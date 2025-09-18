import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from '@/products/dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createProductDto: CreateProductDto) {
    const {
      productCode,
      productName,
      description,
      categoryId,
      unitPrice,
      costPrice,
      barcode,
      weight,
      dimensions,
      imageUrl,
      isActive = true,
      initialStock = 0,
      minimumStock = 0,
      maximumStock,
      reorderPoint = 0,
    } = createProductDto;

    // 상품 코드 중복 확인
    const existingProduct = await this.prisma.product.findUnique({
      where: { productCode },
    });

    if (existingProduct) {
      throw new BadRequestException('이미 존재하는 상품 코드입니다');
    }

    return this.prisma.$transaction(async (prisma) => {
      // 상품 생성
      const product = await prisma.product.create({
        data: {
          productCode,
          productName,
          description,
          categoryId,
          unitPrice,
          costPrice,
          barcode,
          weight,
          dimensions,
          imageUrl,
          isActive,
          createdBy: BigInt(userId),
        },
        include: {
          category: {
            select: {
              id: true,
              categoryName: true,
              parentCategory: {
                select: {
                  id: true,
                  categoryName: true,
                },
              },
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // 재고 정보 생성
      if (initialStock > 0 || minimumStock > 0 || maximumStock || reorderPoint > 0) {
        await prisma.inventory.create({
          data: {
            productId: product.id,
            currentStock: initialStock,
            minimumStock,
            maximumStock,
            reorderPoint,
          },
        });

        // 초기 재고가 있으면 재고 이동 기록 생성
        if (initialStock > 0) {
          await prisma.stockMovement.create({
            data: {
              productId: product.id,
              movementType: 'IN',
              quantity: initialStock,
              unitCost: costPrice,
              referenceType: 'INITIAL',
              notes: '상품 등록 시 초기 재고',
              createdBy: BigInt(userId),
            },
          });
        }
      }

      return {
        ...product,
        id: product.id.toString(),
        categoryId: product.categoryId?.toString(),
        createdBy: product.createdBy.toString(),
        creator: {
          ...product.creator,
          id: product.creator.id.toString(),
        },
        category: product.category ? {
          ...product.category,
          id: product.category.id.toString(),
          parentCategory: product.category.parentCategory ? {
            ...product.category.parentCategory,
            id: product.category.parentCategory.id.toString(),
          } : null,
        } : null,
      };
    });
  }

  async findAll(userId: string, page = 1, limit = 10, search?: string, categoryId?: string) {
    const skip = (page - 1) * limit;

    const where = {
      createdBy: BigInt(userId),
      isActive: true,
      deletedAt: null,
      ...(categoryId && { categoryId: BigInt(categoryId) }),
      ...(search && {
        OR: [
          { productName: { contains: search, mode: 'insensitive' as const } },
          { productCode: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { barcode: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              categoryName: true,
            },
          },
          inventory: {
            select: {
              currentStock: true,
              reservedStock: true,
              minimumStock: true,
              reorderPoint: true,
            },
          },
          supplierProducts: {
            where: { isPreferred: true },
            include: {
              supplier: {
                select: {
                  id: true,
                  companyName: true,
                  supplierCode: true,
                },
              },
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map(product => ({
      ...product,
      id: product.id.toString(),
      categoryId: product.categoryId?.toString(),
      createdBy: product.createdBy.toString(),
      category: product.category ? {
        ...product.category,
        id: product.category.id.toString(),
      } : null,
      inventory: product.inventory ? {
        ...product.inventory,
        id: product.inventory.id.toString(),
        productId: product.inventory.productId.toString(),
        availableStock: product.inventory.currentStock - product.inventory.reservedStock,
      } : null,
      preferredSupplier: product.supplierProducts[0]?.supplier ? {
        ...product.supplierProducts[0].supplier,
        id: product.supplierProducts[0].supplier.id.toString(),
      } : null,
      supplierProducts: undefined,
    }));

    return {
      data: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
        isActive: true,
        deletedAt: null,
      },
      include: {
        category: {
          select: {
            id: true,
            categoryName: true,
            parentCategory: {
              select: {
                id: true,
                categoryName: true,
              },
            },
          },
        },
        inventory: true,
        supplierProducts: {
          include: {
            supplier: {
              select: {
                id: true,
                supplierCode: true,
                companyName: true,
                contactPerson: true,
                email: true,
                phone: true,
              },
            },
          },
          orderBy: {
            isPreferred: 'desc',
          },
        },
        stockMovements: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다');
    }

    return {
      ...product,
      id: product.id.toString(),
      categoryId: product.categoryId?.toString(),
      createdBy: product.createdBy.toString(),
      category: product.category ? {
        ...product.category,
        id: product.category.id.toString(),
        parentCategory: product.category.parentCategory ? {
          ...product.category.parentCategory,
          id: product.category.parentCategory.id.toString(),
        } : null,
      } : null,
      inventory: product.inventory ? {
        ...product.inventory,
        id: product.inventory.id.toString(),
        productId: product.inventory.productId.toString(),
        availableStock: product.inventory.currentStock - product.inventory.reservedStock,
      } : null,
      supplierProducts: product.supplierProducts.map(sp => ({
        ...sp,
        id: sp.id.toString(),
        supplierId: sp.supplierId.toString(),
        productId: sp.productId.toString(),
        supplier: {
          ...sp.supplier,
          id: sp.supplier.id.toString(),
        },
      })),
      stockMovements: product.stockMovements.map(sm => ({
        ...sm,
        id: sm.id.toString(),
        productId: sm.productId.toString(),
        referenceId: sm.referenceId?.toString(),
        createdBy: sm.createdBy.toString(),
        creator: {
          ...sm.creator,
          id: sm.creator.id.toString(),
        },
      })),
      creator: {
        ...product.creator,
        id: product.creator.id.toString(),
      },
    };
  }

  async update(id: string, userId: string, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
        deletedAt: null,
      },
    });

    if (!existingProduct) {
      throw new NotFoundException('상품을 찾을 수 없습니다');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: BigInt(id) },
      data: {
        ...updateProductDto,
        categoryId: updateProductDto.categoryId ? BigInt(updateProductDto.categoryId) : undefined,
        updatedAt: new Date(),
      },
      include: {
        category: {
          select: {
            id: true,
            categoryName: true,
          },
        },
        inventory: true,
      },
    });

    return {
      ...updatedProduct,
      id: updatedProduct.id.toString(),
      categoryId: updatedProduct.categoryId?.toString(),
      createdBy: updatedProduct.createdBy.toString(),
      category: updatedProduct.category ? {
        ...updatedProduct.category,
        id: updatedProduct.category.id.toString(),
      } : null,
      inventory: updatedProduct.inventory ? {
        ...updatedProduct.inventory,
        id: updatedProduct.inventory.id.toString(),
        productId: updatedProduct.inventory.productId.toString(),
      } : null,
    };
  }

  async remove(id: string, userId: string) {
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
        deletedAt: null,
      },
    });

    if (!existingProduct) {
      throw new NotFoundException('상품을 찾을 수 없습니다');
    }

    // 소프트 삭제
    return this.prisma.product.update({
      where: { id: BigInt(id) },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  async adjustStock(id: string, userId: string, quantity: number, reason: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
        deletedAt: null,
      },
      include: {
        inventory: true,
      },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다');
    }

    if (!product.inventory) {
      throw new NotFoundException('재고 정보를 찾을 수 없습니다');
    }

    const currentStock = product.inventory.currentStock;
    const newStock = currentStock + quantity;

    if (newStock < 0) {
      throw new BadRequestException('재고가 부족합니다');
    }

    return this.prisma.$transaction(async (prisma) => {
      // 재고 업데이트
      await prisma.inventory.update({
        where: { productId: BigInt(id) },
        data: { currentStock: newStock },
      });

      // 재고 이동 기록 생성
      await prisma.stockMovement.create({
        data: {
          productId: BigInt(id),
          movementType: quantity > 0 ? 'IN' : 'OUT',
          quantity: Math.abs(quantity),
          referenceType: 'MANUAL',
          notes: reason,
          createdBy: BigInt(userId),
        },
      });

      return { currentStock: newStock };
    });
  }

  async getLowStockProducts(userId: string) {
    // 재고 부족 상품 조회 (현재 재고가 최소 재고 이하)
    const products = await this.prisma.product.findMany({
      where: {
        createdBy: BigInt(userId),
        isActive: true,
        deletedAt: null,
      },
      include: {
        category: {
          select: {
            id: true,
            categoryName: true,
          },
        },
        inventory: true,
        supplierProducts: {
          where: { isPreferred: true },
          include: {
            supplier: {
              select: {
                id: true,
                companyName: true,
                supplierCode: true,
              },
            },
          },
          take: 1,
        },
      },
      orderBy: {
        inventory: {
          currentStock: 'asc',
        },
      },
    });

    const lowStockProducts = products.filter(product =>
      product.inventory &&
      (product.inventory.currentStock <= product.inventory.minimumStock ||
       product.inventory.currentStock <= product.inventory.reorderPoint)
    );

    return lowStockProducts.map(product => ({
      ...product,
      id: product.id.toString(),
      categoryId: product.categoryId?.toString(),
      createdBy: product.createdBy.toString(),
      category: product.category ? {
        ...product.category,
        id: product.category.id.toString(),
      } : null,
      inventory: product.inventory ? {
        ...product.inventory,
        id: product.inventory.id.toString(),
        productId: product.inventory.productId.toString(),
        availableStock: product.inventory.currentStock - product.inventory.reservedStock,
      } : null,
      preferredSupplier: product.supplierProducts[0]?.supplier ? {
        ...product.supplierProducts[0].supplier,
        id: product.supplierProducts[0].supplier.id.toString(),
      } : null,
      supplierProducts: undefined,
    }));
  }
}