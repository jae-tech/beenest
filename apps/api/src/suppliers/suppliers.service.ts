import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from '@/suppliers/dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createSupplierDto: CreateSupplierDto) {
    const { supplierCode, ...data } = createSupplierDto;

    // 공급업체 코드 중복 확인
    const existingSupplier = await this.prisma.supplier.findUnique({
      where: { supplierCode },
    });

    if (existingSupplier) {
      throw new BadRequestException('이미 존재하는 공급업체 코드입니다');
    }

    const supplier = await this.prisma.supplier.create({
      data: {
        supplierCode,
        ...data,
        createdBy: BigInt(userId),
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            supplierProducts: true,
          },
        },
      },
    });

    return {
      ...supplier,
      id: supplier.id.toString(),
      createdBy: supplier.createdBy.toString(),
      creator: {
        ...supplier.creator,
        id: supplier.creator.id.toString(),
      },
      productCount: supplier._count.supplierProducts,
    };
  }

  async findAll(userId: string, page = 1, limit = 10, search?: string, status?: string) {
    const skip = (page - 1) * limit;

    const where = {
      createdBy: BigInt(userId),
      isActive: true,
      deletedAt: null,
      ...(status && { supplierStatus: status }),
      ...(search && {
        OR: [
          { companyName: { contains: search, mode: 'insensitive' as const } },
          { supplierCode: { contains: search, mode: 'insensitive' as const } },
          { contactPerson: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              supplierProducts: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.supplier.count({ where }),
    ]);

    const formattedSuppliers = suppliers.map(supplier => ({
      ...supplier,
      id: supplier.id.toString(),
      createdBy: supplier.createdBy.toString(),
      productCount: supplier._count.supplierProducts,
    }));

    return {
      data: formattedSuppliers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const supplier = await this.prisma.supplier.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
        isActive: true,
        deletedAt: null,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        supplierProducts: {
          include: {
            product: {
              select: {
                id: true,
                productCode: true,
                productName: true,
                unitPrice: true,
                isActive: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            supplierProducts: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException('공급업체를 찾을 수 없습니다');
    }

    return {
      ...supplier,
      id: supplier.id.toString(),
      createdBy: supplier.createdBy.toString(),
      creator: {
        ...supplier.creator,
        id: supplier.creator.id.toString(),
      },
      supplierProducts: supplier.supplierProducts.map(sp => ({
        ...sp,
        id: sp.id.toString(),
        supplierId: sp.supplierId.toString(),
        productId: sp.productId.toString(),
        product: {
          ...sp.product,
          id: sp.product.id.toString(),
        },
      })),
      productCount: supplier._count.supplierProducts,
    };
  }

  async update(id: string, userId: string, updateSupplierDto: UpdateSupplierDto) {
    const existingSupplier = await this.prisma.supplier.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
        deletedAt: null,
      },
    });

    if (!existingSupplier) {
      throw new NotFoundException('공급업체를 찾을 수 없습니다');
    }

    // 공급업체 코드 변경 시 중복 확인
    if (updateSupplierDto.supplierCode && updateSupplierDto.supplierCode !== existingSupplier.supplierCode) {
      const duplicateSupplier = await this.prisma.supplier.findUnique({
        where: { supplierCode: updateSupplierDto.supplierCode },
      });

      if (duplicateSupplier) {
        throw new BadRequestException('이미 존재하는 공급업체 코드입니다');
      }
    }

    const updatedSupplier = await this.prisma.supplier.update({
      where: { id: BigInt(id) },
      data: {
        ...updateSupplierDto,
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            supplierProducts: true,
          },
        },
      },
    });

    return {
      ...updatedSupplier,
      id: updatedSupplier.id.toString(),
      createdBy: updatedSupplier.createdBy.toString(),
      productCount: updatedSupplier._count.supplierProducts,
    };
  }

  async remove(id: string, userId: string) {
    const existingSupplier = await this.prisma.supplier.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
        deletedAt: null,
      },
    });

    if (!existingSupplier) {
      throw new NotFoundException('공급업체를 찾을 수 없습니다');
    }

    // 연결된 상품이 있는지 확인
    const productCount = await this.prisma.supplierProduct.count({
      where: { supplierId: BigInt(id) },
    });

    if (productCount > 0) {
      throw new BadRequestException('연결된 상품이 있는 공급업체는 삭제할 수 없습니다. 먼저 상품 연결을 해제해주세요.');
    }

    // 소프트 삭제
    return this.prisma.supplier.update({
      where: { id: BigInt(id) },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  async getSupplierStats(userId: string) {
    const [totalSuppliers, activeSuppliers, topSuppliers] = await Promise.all([
      // 전체 공급업체 수
      this.prisma.supplier.count({
        where: {
          createdBy: BigInt(userId),
          deletedAt: null,
        },
      }),
      // 활성 공급업체 수
      this.prisma.supplier.count({
        where: {
          createdBy: BigInt(userId),
          isActive: true,
          supplierStatus: 'active',
          deletedAt: null,
        },
      }),
      // 상위 공급업체 (상품 수 기준)
      this.prisma.supplier.findMany({
        where: {
          createdBy: BigInt(userId),
          isActive: true,
          deletedAt: null,
        },
        include: {
          _count: {
            select: {
              supplierProducts: true,
            },
          },
        },
        orderBy: {
          supplierProducts: {
            _count: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    return {
      totalSuppliers,
      activeSuppliers,
      inactiveSuppliers: totalSuppliers - activeSuppliers,
      topSuppliers: topSuppliers.map(supplier => ({
        id: supplier.id.toString(),
        companyName: supplier.companyName,
        supplierCode: supplier.supplierCode,
        productCount: supplier._count.supplierProducts,
        rating: supplier.rating,
      })),
    };
  }

  async addProductToSupplier(
    supplierId: string,
    productId: string,
    userId: string,
    supplierProductData: {
      supplierProductCode?: string;
      supplierPrice?: number;
      minimumOrderQty?: number;
      leadTimeDays?: number;
      isPreferred?: boolean;
    },
  ) {
    // 공급업체와 상품 존재 확인
    const [supplier, product] = await Promise.all([
      this.prisma.supplier.findFirst({
        where: {
          id: BigInt(supplierId),
          createdBy: BigInt(userId),
          deletedAt: null,
        },
      }),
      this.prisma.product.findFirst({
        where: {
          id: BigInt(productId),
          createdBy: BigInt(userId),
          deletedAt: null,
        },
      }),
    ]);

    if (!supplier) {
      throw new NotFoundException('공급업체를 찾을 수 없습니다');
    }

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다');
    }

    // 이미 연결된 관계인지 확인
    const existingRelation = await this.prisma.supplierProduct.findUnique({
      where: {
        supplierId_productId: {
          supplierId: BigInt(supplierId),
          productId: BigInt(productId),
        },
      },
    });

    if (existingRelation) {
      throw new BadRequestException('이미 연결된 공급업체-상품 관계입니다');
    }

    const supplierProduct = await this.prisma.supplierProduct.create({
      data: {
        supplierId: BigInt(supplierId),
        productId: BigInt(productId),
        ...supplierProductData,
      },
      include: {
        supplier: {
          select: {
            id: true,
            companyName: true,
            supplierCode: true,
          },
        },
        product: {
          select: {
            id: true,
            productCode: true,
            productName: true,
            unitPrice: true,
          },
        },
      },
    });

    return {
      ...supplierProduct,
      id: supplierProduct.id.toString(),
      supplierId: supplierProduct.supplierId.toString(),
      productId: supplierProduct.productId.toString(),
      supplier: {
        ...supplierProduct.supplier,
        id: supplierProduct.supplier.id.toString(),
      },
      product: {
        ...supplierProduct.product,
        id: supplierProduct.product.id.toString(),
      },
    };
  }
}