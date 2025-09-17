import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from '@/categories/dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { categoryName, parentCategoryId, displayOrder = 0, isActive = true } = createCategoryDto;

    // 부모 카테고리가 있으면 존재하는지 확인
    if (parentCategoryId) {
      const parentCategory = await this.prisma.productCategory.findUnique({
        where: { id: parentCategoryId },
      });

      if (!parentCategory) {
        throw new NotFoundException('부모 카테고리를 찾을 수 없습니다');
      }
    }

    const category = await this.prisma.productCategory.create({
      data: {
        categoryName,
        parentCategoryId,
        displayOrder,
        isActive,
      },
      include: {
        parentCategory: {
          select: {
            id: true,
            categoryName: true,
          },
        },
        _count: {
          select: {
            childCategories: true,
            products: true,
          },
        },
      },
    });

    return {
      ...category,
      id: category.id.toString(),
      parentCategoryId: category.parentCategoryId?.toString(),
      parentCategory: category.parentCategory ? {
        ...category.parentCategory,
        id: category.parentCategory.id.toString(),
      } : null,
      childrenCount: category._count.childCategories,
      productCount: category._count.products,
    };
  }

  async findAll(includeInactive = false) {
    const categories = await this.prisma.productCategory.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        parentCategory: {
          select: {
            id: true,
            categoryName: true,
          },
        },
        childCategories: {
          select: {
            id: true,
            categoryName: true,
            displayOrder: true,
            isActive: true,
          },
          orderBy: {
            displayOrder: 'asc',
          },
        },
        _count: {
          select: {
            childCategories: true,
            products: true,
          },
        },
      },
      orderBy: [
        { parentCategoryId: 'asc' },
        { displayOrder: 'asc' },
        { categoryName: 'asc' },
      ],
    });

    return categories.map(category => ({
      ...category,
      id: category.id.toString(),
      parentCategoryId: category.parentCategoryId?.toString(),
      parentCategory: category.parentCategory ? {
        ...category.parentCategory,
        id: category.parentCategory.id.toString(),
      } : null,
      childCategories: category.childCategories.map(child => ({
        ...child,
        id: child.id.toString(),
      })),
      childrenCount: category._count.childCategories,
      productCount: category._count.products,
    }));
  }

  async findTree() {
    // 루트 카테고리들 (부모가 없는 카테고리)
    const rootCategories = await this.prisma.productCategory.findMany({
      where: {
        parentCategoryId: null,
        isActive: true,
      },
      include: {
        childCategories: {
          where: { isActive: true },
          include: {
            childCategories: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' },
            },
            _count: {
              select: {
                products: true,
              },
            },
          },
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return rootCategories.map(category => this.formatCategoryTree(category));
  }

  private formatCategoryTree(category: any): any {
    return {
      ...category,
      id: category.id.toString(),
      productCount: category._count.products,
      children: category.childCategories ? category.childCategories.map((child: any) => ({
        ...child,
        id: child.id.toString(),
        productCount: child._count.products,
        children: child.childCategories ? child.childCategories.map((grandChild: any) => ({
          ...grandChild,
          id: grandChild.id.toString(),
        })) : [],
      })) : [],
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.productCategory.findUnique({
      where: { id: BigInt(id) },
      include: {
        parentCategory: {
          select: {
            id: true,
            categoryName: true,
          },
        },
        childCategories: {
          select: {
            id: true,
            categoryName: true,
            displayOrder: true,
            isActive: true,
          },
          orderBy: {
            displayOrder: 'asc',
          },
        },
        products: {
          where: {
            isActive: true,
            deletedAt: null,
          },
          select: {
            id: true,
            productCode: true,
            productName: true,
            unitPrice: true,
            inventory: {
              select: {
                currentStock: true,
                minimumStock: true,
              },
            },
          },
          take: 20,
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            childCategories: true,
            products: {
              where: {
                isActive: true,
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다');
    }

    return {
      ...category,
      id: category.id.toString(),
      parentCategoryId: category.parentCategoryId?.toString(),
      parentCategory: category.parentCategory ? {
        ...category.parentCategory,
        id: category.parentCategory.id.toString(),
      } : null,
      childCategories: category.childCategories.map(child => ({
        ...child,
        id: child.id.toString(),
      })),
      products: category.products.map(product => ({
        ...product,
        id: product.id.toString(),
        inventory: product.inventory ? {
          ...product.inventory,
          availableStock: product.inventory.currentStock,
        } : null,
      })),
      childrenCount: category._count.childCategories,
      productCount: category._count.products,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.prisma.productCategory.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingCategory) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다');
    }

    // 부모 카테고리 변경 시 순환 참조 방지
    if (updateCategoryDto.parentCategoryId) {
      await this.checkCircularReference(BigInt(id), updateCategoryDto.parentCategoryId);
    }

    const updatedCategory = await this.prisma.productCategory.update({
      where: { id: BigInt(id) },
      data: {
        ...updateCategoryDto,
        updatedAt: new Date(),
      },
      include: {
        parentCategory: {
          select: {
            id: true,
            categoryName: true,
          },
        },
        _count: {
          select: {
            childCategories: true,
            products: true,
          },
        },
      },
    });

    return {
      ...updatedCategory,
      id: updatedCategory.id.toString(),
      parentCategoryId: updatedCategory.parentCategoryId?.toString(),
      parentCategory: updatedCategory.parentCategory ? {
        ...updatedCategory.parentCategory,
        id: updatedCategory.parentCategory.id.toString(),
      } : null,
      childrenCount: updatedCategory._count.childCategories,
      productCount: updatedCategory._count.products,
    };
  }

  async remove(id: string) {
    const category = await this.prisma.productCategory.findUnique({
      where: { id: BigInt(id) },
      include: {
        _count: {
          select: {
            childCategories: true,
            products: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다');
    }

    // 하위 카테고리가 있으면 삭제 불가
    if (category._count.childCategories > 0) {
      throw new BadRequestException('하위 카테고리가 있는 카테고리는 삭제할 수 없습니다');
    }

    // 연결된 상품이 있으면 삭제 불가
    if (category._count.products > 0) {
      throw new BadRequestException('연결된 상품이 있는 카테고리는 삭제할 수 없습니다');
    }

    return this.prisma.productCategory.delete({
      where: { id: BigInt(id) },
    });
  }

  private async checkCircularReference(categoryId: bigint, parentCategoryId: bigint) {
    // 자기 자신을 부모로 설정하려는 경우
    if (categoryId === parentCategoryId) {
      throw new BadRequestException('자기 자신을 부모 카테고리로 설정할 수 없습니다');
    }

    // 순환 참조 확인 (부모의 부모들을 따라가면서 현재 카테고리가 나오는지 확인)
    let currentParentId: bigint | null = parentCategoryId;
    const visitedIds = new Set<string>();

    while (currentParentId) {
      const currentParentIdStr = currentParentId.toString();

      if (visitedIds.has(currentParentIdStr)) {
        throw new BadRequestException('순환 참조가 발생합니다');
      }

      if (currentParentId === categoryId) {
        throw new BadRequestException('순환 참조가 발생합니다');
      }

      visitedIds.add(currentParentIdStr);

      const parent = await this.prisma.productCategory.findUnique({
        where: { id: currentParentId },
        select: { parentCategoryId: true },
      });

      currentParentId = parent?.parentCategoryId ?? null;
    }
  }

  async getCategoryStats() {
    const [totalCategories, rootCategories, categoriesWithProducts] = await Promise.all([
      // 전체 카테고리 수
      this.prisma.productCategory.count({
        where: { isActive: true },
      }),
      // 루트 카테고리 수
      this.prisma.productCategory.count({
        where: {
          parentCategoryId: null,
          isActive: true,
        },
      }),
      // 상품이 있는 카테고리들
      this.prisma.productCategory.findMany({
        where: {
          isActive: true,
          products: {
            some: {
              isActive: true,
              deletedAt: null,
            },
          },
        },
        include: {
          _count: {
            select: {
              products: {
                where: {
                  isActive: true,
                  deletedAt: null,
                },
              },
            },
          },
        },
        orderBy: {
          products: {
            _count: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    return {
      totalCategories,
      rootCategories,
      subCategories: totalCategories - rootCategories,
      categoriesWithProducts: categoriesWithProducts.length,
      topCategories: categoriesWithProducts.map(category => ({
        id: category.id.toString(),
        categoryName: category.categoryName,
        productCount: category._count.products,
      })),
    };
  }
}