import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId: string) {
    const [
      totalProducts,
      totalSuppliers,
      lowStockCount,
      outOfStockCount,
      totalInventoryValue,
      recentOrdersCount,
    ] = await Promise.all([
      // 전체 상품 수
      this.prisma.product.count({
        where: {
          createdBy: BigInt(userId),
          isActive: true,
          deletedAt: null,
        },
      }),
      // 전체 거래처 수
      this.prisma.supplier.count({
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
            currentStock: {
              lte: this.prisma.inventory.fields.minimumStock,
            },
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
      // 총 재고 가치
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
      // 최근 7일 주문 수 (임시로 0)
      Promise.resolve(0),
    ]);

    // 재고 가치 계산
    const inventoryValue = totalInventoryValue.reduce((sum, product) => {
      if (product.inventory && product.costPrice) {
        return sum + Number(product.costPrice) * product.inventory.currentStock;
      }
      return sum;
    }, 0);

    return {
      overview: {
        totalProducts,
        totalSuppliers,
        totalInventoryValue: inventoryValue,
        recentOrders: recentOrdersCount,
      },
      inventory: {
        lowStockCount,
        outOfStockCount,
        normalStockCount: totalProducts - lowStockCount - outOfStockCount,
        alertsCount: lowStockCount + outOfStockCount,
      },
    };
  }

  async getInventoryChart(userId: string) {
    // 사용자의 상품들을 카테고리별로 그룹화
    const products = await this.prisma.product.findMany({
      where: {
        createdBy: BigInt(userId),
        isActive: true,
        deletedAt: null,
      },
      select: {
        categoryId: true,
        category: {
          select: {
            categoryName: true,
          },
        },
        inventory: {
          select: {
            currentStock: true,
          },
        },
      },
    });

    // 카테고리별로 재고 집계
    const categoryMap = new Map();

    products.forEach((product) => {
      const categoryName = product.category?.categoryName || '미분류';
      const currentStock = product.inventory?.currentStock || 0;

      if (categoryMap.has(categoryName)) {
        const existing = categoryMap.get(categoryName);
        existing.stock += currentStock;
        existing.productCount += 1;
      } else {
        categoryMap.set(categoryName, {
          category: categoryName,
          stock: currentStock,
          productCount: 1,
        });
      }
    });

    return Array.from(categoryMap.values());
  }

  async getStockMovementChart(userId: string, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const movements = await this.prisma.stockMovement.findMany({
      where: {
        createdBy: BigInt(userId),
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        movementType: true,
        quantity: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // 날짜별로 그룹화
    const dailyData = new Map();

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dailyData.set(dateKey, { date: dateKey, in: 0, out: 0, adjust: 0 });
    }

    movements.forEach((movement) => {
      const dateKey = movement.createdAt.toISOString().split('T')[0];
      const dayData = dailyData.get(dateKey);

      if (dayData) {
        switch (movement.movementType) {
          case 'IN':
            dayData.in += movement.quantity;
            break;
          case 'OUT':
            dayData.out += movement.quantity;
            break;
          case 'ADJUST':
            dayData.adjust += movement.quantity;
            break;
        }
      }
    });

    return Array.from(dailyData.values()).reverse();
  }

  async getRecentAlerts(userId: string, limit = 10) {
    // 재고 부족 상품들
    const lowStockProducts = await this.prisma.product.findMany({
      where: {
        createdBy: BigInt(userId),
        isActive: true,
        deletedAt: null,
        inventory: {
          OR: [
            { currentStock: { lte: 0 } },
            {
              currentStock: { lte: this.prisma.inventory.fields.minimumStock },
            },
          ],
        },
      },
      select: {
        id: true,
        productName: true,
        productCode: true,
        inventory: {
          select: {
            currentStock: true,
            minimumStock: true,
          },
        },
      },
      take: limit,
      orderBy: {
        inventory: {
          currentStock: 'asc',
        },
      },
    });

    return lowStockProducts.map((product) => ({
      id: product.id.toString(),
      type: product.inventory!.currentStock <= 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
      title: `${product.productName} 재고 ${product.inventory!.currentStock <= 0 ? '품절' : '부족'}`,
      message: `${product.productCode} - 현재 재고: ${product.inventory!.currentStock}개`,
      severity: product.inventory!.currentStock <= 0 ? 'high' : 'medium',
      createdAt: new Date(),
    }));
  }
}
