import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateInventoryDto } from '@/inventory/dto';
import { AdjustStockDto } from '@/products/dto';
import { mapStockMovement } from '@/common/type-mappers';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async adjustStock(productId: string, userId: string, adjustStockDto: AdjustStockDto) {
    const {
      quantity,
      movementType,
      unitCost,
      referenceType = 'ADJUSTMENT',
      referenceId,
      notes,
    } = adjustStockDto;

    return this.prisma.$transaction(async (prisma) => {
      // 상품과 재고 정보 조회
      const product = await prisma.product.findFirst({
        where: {
          id: BigInt(productId),
          createdBy: BigInt(userId),
          isActive: true,
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
      let newStock: number;

      // 재고 이동 타입에 따른 계산
      switch (movementType) {
        case 'IN':
          newStock = currentStock + quantity;
          break;
        case 'OUT':
          newStock = currentStock - quantity;
          if (newStock < 0) {
            throw new BadRequestException('재고가 부족합니다');
          }
          break;
        case 'ADJUST':
          // quantity가 양수면 증가, 음수면 감소
          newStock = currentStock + quantity;
          if (newStock < 0) {
            throw new BadRequestException('조정 후 재고가 음수가 될 수 없습니다');
          }
          break;
        case 'TRANSFER':
          // 일단 OUT으로 처리 (실제로는 다른 창고로 이동)
          newStock = currentStock - quantity;
          if (newStock < 0) {
            throw new BadRequestException('이전할 재고가 부족합니다');
          }
          break;
        default:
          throw new BadRequestException('올바르지 않은 이동 타입입니다');
      }

      // 재고 업데이트
      const updatedInventory = await prisma.inventory.update({
        where: { productId: BigInt(productId) },
        data: {
          currentStock: newStock,
          lastStockCheckAt: new Date(),
        },
      });

      // 재고 이동 기록 생성
      const stockMovement = await prisma.stockMovement.create({
        data: {
          productId: BigInt(productId),
          movementType,
          quantity,
          unitCost,
          referenceType,
          referenceId: referenceId ? BigInt(referenceId) : null,
          notes,
          createdBy: BigInt(userId),
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          product: {
            select: {
              id: true,
              productCode: true,
              productName: true,
            },
          },
        },
      });

      return {
        stockMovement: {
          ...stockMovement,
          id: stockMovement.id.toString(),
          productId: stockMovement.productId.toString(),
          referenceId: stockMovement.referenceId?.toString(),
          createdBy: stockMovement.createdBy.toString(),
          creator: {
            ...stockMovement.creator,
            id: stockMovement.creator.id.toString(),
          },
          product: {
            ...stockMovement.product,
            id: stockMovement.product.id.toString(),
          },
        },
        inventory: {
          ...updatedInventory,
          id: updatedInventory.id.toString(),
          productId: updatedInventory.productId.toString(),
          availableStock: updatedInventory.currentStock - updatedInventory.reservedStock,
          previousStock: currentStock,
        },
      };
    });
  }

  async updateInventorySettings(productId: string, userId: string, updateInventoryDto: UpdateInventoryDto) {
    // 상품 소유권 확인
    const product = await this.prisma.product.findFirst({
      where: {
        id: BigInt(productId),
        createdBy: BigInt(userId),
        isActive: true,
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
      // 재고 정보가 없으면 생성
      const newInventory = await this.prisma.inventory.create({
        data: {
          productId: BigInt(productId),
          ...updateInventoryDto,
        },
      });

      return {
        ...newInventory,
        id: newInventory.id.toString(),
        productId: newInventory.productId.toString(),
        availableStock: newInventory.currentStock - newInventory.reservedStock,
      };
    }

    // 재고 설정 업데이트
    const updatedInventory = await this.prisma.inventory.update({
      where: { productId: BigInt(productId) },
      data: updateInventoryDto,
    });

    return {
      ...updatedInventory,
      id: updatedInventory.id.toString(),
      productId: updatedInventory.productId.toString(),
      availableStock: updatedInventory.currentStock - updatedInventory.reservedStock,
    };
  }

  async getInventoryByProduct(productId: string, userId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: BigInt(productId),
        createdBy: BigInt(userId),
        isActive: true,
        deletedAt: null,
      },
      include: {
        inventory: true,
        category: {
          select: {
            id: true,
            categoryName: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다');
    }

    return {
      product: {
        id: product.id.toString(),
        productCode: product.productCode,
        productName: product.productName,
        unitPrice: product.unitPrice,
        costPrice: product.costPrice,
        category: product.category ? {
          ...product.category,
          id: product.category.id.toString(),
        } : null,
      },
      inventory: product.inventory ? {
        ...product.inventory,
        id: product.inventory.id.toString(),
        productId: product.inventory.productId.toString(),
        availableStock: product.inventory.currentStock - product.inventory.reservedStock,
      } : null,
    };
  }

  async getLowStockAlert(userId: string) {
    const lowStockProducts = await this.prisma.product.findMany({
      where: {
        createdBy: BigInt(userId),
        isActive: true,
        deletedAt: null,
        inventory: {
          OR: [
            // 현재 재고가 최소 재고보다 적거나 같은 경우
            {
              currentStock: {
                lte: this.prisma.inventory.fields.minimumStock,
              },
            },
            // 또는 재주문 기준점보다 적거나 같은 경우
            {
              currentStock: {
                lte: this.prisma.inventory.fields.reorderPoint,
              },
            },
            // 또는 품절인 경우
            { currentStock: { lte: 0 } },
          ],
        },
      },
      include: {
        inventory: true,
        category: {
          select: {
            id: true,
            categoryName: true,
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
                contactPerson: true,
                phone: true,
                email: true,
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

    return lowStockProducts.map(product => ({
      product: {
        id: product.id.toString(),
        productCode: product.productCode,
        productName: product.productName,
        unitPrice: product.unitPrice,
        category: product.category ? {
          ...product.category,
          id: product.category.id.toString(),
        } : null,
      },
      inventory: product.inventory ? {
        ...product.inventory,
        id: product.inventory.id.toString(),
        productId: product.inventory.productId.toString(),
        availableStock: product.inventory.currentStock - product.inventory.reservedStock,
        alertType: product.inventory.currentStock <= 0 ? 'OUT_OF_STOCK' :
                   product.inventory.currentStock <= product.inventory.reorderPoint ? 'REORDER_POINT' :
                   'LOW_STOCK',
      } : null,
      preferredSupplier: product.supplierProducts[0]?.supplier ? {
        ...product.supplierProducts[0].supplier,
        id: product.supplierProducts[0].supplier.id.toString(),
      } : null,
    }));
  }

  async getStockMovements(productId: string, userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // 상품 소유권 확인
    const product = await this.prisma.product.findFirst({
      where: {
        id: BigInt(productId),
        createdBy: BigInt(userId),
        deletedAt: null,
      },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다');
    }

    const [movements, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where: { productId: BigInt(productId) },
        skip,
        take: limit,
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
      }),
      this.prisma.stockMovement.count({
        where: { productId: BigInt(productId) },
      }),
    ]);

    return {
      data: movements.map(movement => ({
        ...movement,
        id: movement.id.toString(),
        productId: movement.productId.toString(),
        referenceId: movement.referenceId?.toString(),
        createdBy: movement.createdBy.toString(),
        creator: {
          ...movement.creator,
          id: movement.creator.id.toString(),
        },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllMovements(userId: string, page = 1, limit = 20, productId?: string) {
    const skip = (page - 1) * limit;

    // 필터 조건 구성
    const whereClause: any = {
      product: {
        createdBy: BigInt(userId),
        deletedAt: null,
      },
    };

    // 특정 상품 필터링
    if (productId) {
      whereClause.productId = BigInt(productId);
    }

    const [movements, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          product: {
            select: {
              id: true,
              productCode: true,
              productName: true,
              unitPrice: true,
              category: {
                select: {
                  id: true,
                  categoryName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.stockMovement.count({
        where: whereClause,
      }),
    ]);

    return {
      data: movements.map(movement => mapStockMovement({
        ...movement,
        id: movement.id.toString(),
        productId: movement.productId.toString(),
        referenceId: movement.referenceId?.toString(),
        createdBy: movement.createdBy.toString(),
        creator: {
          ...movement.creator,
          id: movement.creator.id.toString(),
        },
        product: {
          ...movement.product,
          id: movement.product.id.toString(),
          unitPrice: Number(movement.product.unitPrice),
          category: movement.product.category ? {
            ...movement.product.category,
            id: movement.product.category.id.toString(),
          } : null,
        },
        unitCost: movement.unitCost ? Number(movement.unitCost) : undefined,
        referenceType: movement.referenceType || undefined,
        notes: movement.notes || undefined,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getInventoryStats(userId: string) {
    const [totalProducts, lowStockCount, outOfStockCount, totalInventoryValue] = await Promise.all([
      // 전체 상품 수
      this.prisma.product.count({
        where: {
          createdBy: BigInt(userId),
          isActive: true,
          deletedAt: null,
        },
      }),
      // 재고 부족 상품 수
      this.prisma.product.count({
        where: {
          createdBy: BigInt(userId),
          isActive: true,
          deletedAt: null,
          inventory: {
            AND: [
              { currentStock: { gt: 0 } },
              {
                OR: [
                  { currentStock: { lte: this.prisma.inventory.fields.minimumStock } },
                  { currentStock: { lte: this.prisma.inventory.fields.reorderPoint } },
                ],
              },
            ],
          },
        },
      }),
      // 품절 상품 수
      this.prisma.product.count({
        where: {
          createdBy: BigInt(userId),
          isActive: true,
          deletedAt: null,
          inventory: {
            currentStock: { lte: 0 },
          },
        },
      }),
      // 총 재고 가치 계산
      this.prisma.product.findMany({
        where: {
          createdBy: BigInt(userId),
          isActive: true,
          deletedAt: null,
        },
        select: {
          costPrice: true,
          inventory: {
            select: {
              currentStock: true,
            },
          },
        },
      }),
    ]);

    // 재고 가치 계산
    const inventoryValue = totalInventoryValue.reduce((sum, product) => {
      if (product.inventory && product.costPrice) {
        return sum + (Number(product.costPrice) * product.inventory.currentStock);
      }
      return sum;
    }, 0);

    return {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      normalStockCount: totalProducts - lowStockCount - outOfStockCount,
      totalInventoryValue: inventoryValue,
      alertsCount: lowStockCount + outOfStockCount,
    };
  }
}