import { CreateOrderDto, UpdateOrderDto } from '@/orders/dto';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { supplierId, items, expectedDeliveryDate, notes } = createOrderDto;

    return this.prisma.$transaction(async (prisma) => {
      // 거래처 확인
      const supplier = await prisma.supplier.findFirst({
        where: {
          id: BigInt(supplierId),
          createdBy: BigInt(userId),
          isActive: true,
          deletedAt: null,
        },
      });

      if (!supplier) {
        throw new NotFoundException('거래처를 찾을 수 없습니다');
      }

      // 상품들 확인 및 가격 계산
      let totalAmount = 0;
      const validatedItems: Array<{
        productId: bigint;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }> = [];

      for (const item of items) {
        const product = await prisma.product.findFirst({
          where: {
            id: BigInt(item.productId),
            createdBy: BigInt(userId),
            isActive: true,
            deletedAt: null,
          },
        });

        if (!product) {
          throw new NotFoundException(
            `상품 ID ${item.productId}를 찾을 수 없습니다`,
          );
        }

        const unitPrice = item.unitPrice || Number(product.unitPrice) || 0;
        const itemTotal = unitPrice * item.quantity;
        totalAmount += itemTotal;

        validatedItems.push({
          productId: BigInt(item.productId),
          quantity: item.quantity,
          unitPrice,
          totalPrice: itemTotal,
        });
      }

      // 주문 번호 생성 (PO + 날짜 + 순번)
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const orderCount = await prisma.purchaseOrder.count({
        where: {
          createdBy: BigInt(userId),
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      });
      const orderNumber = `PO${today}${String(orderCount + 1).padStart(3, '0')}`;

      // 주문 생성
      const order = await prisma.purchaseOrder.create({
        data: {
          orderNumber,
          supplierId: BigInt(supplierId),
          status: 'PENDING',
          totalAmount,
          expectedDeliveryDate: expectedDeliveryDate
            ? new Date(expectedDeliveryDate)
            : null,
          notes,
          createdBy: BigInt(userId),
        },
        include: {
          supplier: {
            select: {
              id: true,
              companyName: true,
              supplierCode: true,
            },
          },
        },
      });

      // 주문 항목들 생성
      const orderItems = await Promise.all(
        validatedItems.map((item) =>
          prisma.purchaseOrderItem.create({
            data: {
              orderId: order.id,
              ...item,
            },
            include: {
              product: {
                select: {
                  id: true,
                  productCode: true,
                  productName: true,
                },
              },
            },
          }),
        ),
      );

      return {
        order: {
          ...order,
          id: order.id.toString(),
          supplierId: order.supplierId.toString(),
          createdBy: order.createdBy.toString(),
          supplier: {
            ...order.supplier,
            id: order.supplier.id.toString(),
          },
        },
        items: orderItems.map((item) => ({
          ...item,
          id: item.id.toString(),
          orderId: item.orderId.toString(),
          productId: item.productId.toString(),
          product: {
            ...item.product,
            id: item.product.id.toString(),
          },
        })),
      };
    });
  }

  async findAll(userId: string, page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;

    const where = {
      createdBy: BigInt(userId),
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where,
        skip,
        take: limit,
        include: {
          supplier: {
            select: {
              id: true,
              companyName: true,
              supplierCode: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  productCode: true,
                  productName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);

    return {
      data: orders.map((order) => ({
        ...order,
        id: order.id.toString(),
        supplierId: order.supplierId.toString(),
        createdBy: order.createdBy.toString(),
        supplier: {
          ...order.supplier,
          id: order.supplier.id.toString(),
        },
        items: order.items.map((item) => ({
          ...item,
          id: item.id.toString(),
          orderId: item.orderId.toString(),
          productId: item.productId.toString(),
          product: {
            ...item.product,
            id: item.product.id.toString(),
          },
        })),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.purchaseOrder.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
      },
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
        items: {
          include: {
            product: {
              select: {
                id: true,
                productCode: true,
                productName: true,
                unitPrice: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('주문을 찾을 수 없습니다');
    }

    return {
      ...order,
      id: order.id.toString(),
      supplierId: order.supplierId.toString(),
      createdBy: order.createdBy.toString(),
      supplier: {
        ...order.supplier,
        id: order.supplier.id.toString(),
      },
      items: order.items.map((item) => ({
        ...item,
        id: item.id.toString(),
        orderId: item.orderId.toString(),
        productId: item.productId.toString(),
        product: {
          ...item.product,
          id: item.product.id.toString(),
        },
      })),
    };
  }

  async update(id: string, userId: string, updateOrderDto: UpdateOrderDto) {
    const existingOrder = await this.prisma.purchaseOrder.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
      },
    });

    if (!existingOrder) {
      throw new NotFoundException('주문을 찾을 수 없습니다');
    }

    // 취소된 주문은 수정 불가
    if (existingOrder.status === 'CANCELLED') {
      throw new BadRequestException('취소된 주문은 수정할 수 없습니다');
    }

    const { items, ...orderData } = updateOrderDto;

    return this.prisma.$transaction(async (prisma) => {
      // 주문 정보 업데이트
      const updatedOrder = await prisma.purchaseOrder.update({
        where: { id: BigInt(id) },
        data: {
          ...orderData,
          expectedDeliveryDate: orderData.expectedDeliveryDate
            ? new Date(orderData.expectedDeliveryDate)
            : undefined,
        },
        include: {
          supplier: {
            select: {
              id: true,
              companyName: true,
              supplierCode: true,
            },
          },
        },
      });

      // 주문 항목 업데이트 (요청된 경우)
      if (items) {
        // 기존 항목들 삭제
        await prisma.purchaseOrderItem.deleteMany({
          where: { orderId: BigInt(id) },
        });

        // 새 항목들 생성
        let totalAmount = 0;
        const newItems: Array<{
          id: string;
          orderId: string;
          productId: string;
          quantity: number;
          unitPrice: number;
          totalPrice: number;
          product: {
            id: string;
            productCode: string;
            productName: string;
          };
        }> = [];

        for (const item of items) {
          const product = await prisma.product.findFirst({
            where: {
              id: BigInt(item.productId),
              createdBy: BigInt(userId),
              isActive: true,
              deletedAt: null,
            },
          });

          if (!product) {
            throw new NotFoundException(
              `상품 ID ${item.productId}를 찾을 수 없습니다`,
            );
          }

          const unitPrice = item.unitPrice || Number(product.unitPrice) || 0;
          const itemTotal = unitPrice * item.quantity;
          totalAmount += itemTotal;

          const orderItem = await prisma.purchaseOrderItem.create({
            data: {
              orderId: BigInt(id),
              productId: BigInt(item.productId),
              quantity: item.quantity,
              unitPrice,
              totalPrice: itemTotal,
            },
            include: {
              product: {
                select: {
                  id: true,
                  productCode: true,
                  productName: true,
                },
              },
            },
          });

          newItems.push({
            id: orderItem.id.toString(),
            orderId: orderItem.orderId.toString(),
            productId: orderItem.productId.toString(),
            quantity: orderItem.quantity,
            unitPrice: Number(orderItem.unitPrice),
            totalPrice: Number(orderItem.totalPrice),
            product: {
              ...orderItem.product,
              id: orderItem.product.id.toString(),
            },
          });
        }

        // 총액 업데이트
        await prisma.purchaseOrder.update({
          where: { id: BigInt(id) },
          data: { totalAmount },
        });

        return {
          order: {
            ...updatedOrder,
            id: updatedOrder.id.toString(),
            supplierId: updatedOrder.supplierId.toString(),
            createdBy: updatedOrder.createdBy.toString(),
            totalAmount,
            supplier: {
              ...updatedOrder.supplier,
              id: updatedOrder.supplier.id.toString(),
            },
          },
          items: newItems,
        };
      }

      return {
        ...updatedOrder,
        id: updatedOrder.id.toString(),
        supplierId: updatedOrder.supplierId.toString(),
        createdBy: updatedOrder.createdBy.toString(),
        supplier: {
          ...updatedOrder.supplier,
          id: updatedOrder.supplier.id.toString(),
        },
      };
    });
  }

  async remove(id: string, userId: string) {
    const order = await this.prisma.purchaseOrder.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
      },
    });

    if (!order) {
      throw new NotFoundException('주문을 찾을 수 없습니다');
    }

    // 이미 배송된 주문은 삭제 불가
    if (order.status === 'DELIVERED') {
      throw new BadRequestException('배송 완료된 주문은 삭제할 수 없습니다');
    }

    return this.prisma.$transaction(async (prisma) => {
      // 주문 항목들 삭제
      await prisma.purchaseOrderItem.deleteMany({
        where: { orderId: BigInt(id) },
      });

      // 주문 삭제
      await prisma.purchaseOrder.delete({
        where: { id: BigInt(id) },
      });

      return { message: '주문이 삭제되었습니다' };
    });
  }

  async getOrderStats(userId: string) {
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      monthlyTotal,
    ] = await Promise.all([
      this.prisma.purchaseOrder.count({
        where: { createdBy: BigInt(userId) },
      }),
      this.prisma.purchaseOrder.count({
        where: { createdBy: BigInt(userId), status: 'PENDING' },
      }),
      this.prisma.purchaseOrder.count({
        where: { createdBy: BigInt(userId), status: 'CONFIRMED' },
      }),
      this.prisma.purchaseOrder.count({
        where: { createdBy: BigInt(userId), status: 'DELIVERED' },
      }),
      this.prisma.purchaseOrder.aggregate({
        where: {
          createdBy: BigInt(userId),
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      monthlyOrderValue: monthlyTotal._sum.totalAmount || 0,
    };
  }
}
