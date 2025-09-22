import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionQueryDto,
} from './dto';
import { TransactionStatus, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  // 거래번호 생성
  private async generateTransactionNumber(transactionType: TransactionType): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = transactionType === TransactionType.SALE ? 'SAL' : 'PUR';

    // 해당 날짜의 마지막 거래번호 조회
    const lastTransaction = await this.prisma.transaction.findFirst({
      where: {
        transactionNumber: {
          startsWith: `${prefix}-${dateStr}`,
        },
      },
      orderBy: {
        transactionNumber: 'desc',
      },
    });

    let sequence = 1;
    if (lastTransaction) {
      const lastSequence = parseInt(lastTransaction.transactionNumber.slice(-3));
      sequence = lastSequence + 1;
    }

    return `${prefix}-${dateStr}-${sequence.toString().padStart(3, '0')}`;
  }

  // 거래 생성
  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const {
      transactionType,
      transactionDate,
      supplierId,
      customerName,
      customerPhone,
      notes,
      items,
    } = createTransactionDto;

    // 거래번호 생성
    const transactionNumber = await this.generateTransactionNumber(transactionType);

    // 금액 계산
    let subtotalAmount = 0;
    const processedItems = items.map(item => {
      const totalPrice = item.quantity * item.unitPrice;
      subtotalAmount += totalPrice;
      return {
        ...item,
        totalPrice,
      };
    });

    const vatAmount = Math.round(subtotalAmount * 0.1);
    const totalAmount = subtotalAmount + vatAmount;

    return this.prisma.$transaction(async (prisma) => {
      // 거래 생성
      const transaction = await prisma.transaction.create({
        data: {
          transactionNumber,
          transactionType,
          transactionDate: new Date(transactionDate),
          supplierId: supplierId ? BigInt(supplierId) : null,
          customerName,
          customerPhone,
          subtotalAmount,
          vatAmount,
          totalAmount,
          notes,
          createdBy: BigInt(userId),
        },
      });

      // 거래 품목 생성
      const transactionItems = await Promise.all(
        processedItems.map(item =>
          prisma.transactionItem.create({
            data: {
              transactionId: transaction.id,
              productId: BigInt(item.productId),
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            },
          })
        )
      );

      return {
        ...transaction,
        items: transactionItems,
      };
    });
  }

  // 거래 목록 조회
  async findAll(userId: string, query: TransactionQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      transactionType,
      status,
      startDate,
      endDate,
      supplierId,
      customerName,
      productId,
    } = query;

    const skip = (page - 1) * limit;
    const where: any = {
      createdBy: BigInt(userId),
    };

    // 필터 조건 추가
    if (search) {
      where.OR = [
        { transactionNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        {
          supplier: {
            companyName: { contains: search, mode: 'insensitive' }
          }
        },
      ];
    }

    if (transactionType) {
      where.transactionType = transactionType;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) {
        where.transactionDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.transactionDate.lte = new Date(endDate);
      }
    }

    if (supplierId) {
      where.supplierId = BigInt(supplierId);
    }

    if (customerName) {
      where.customerName = { contains: customerName, mode: 'insensitive' };
    }

    if (productId) {
      where.transactionItems = {
        some: {
          productId: BigInt(productId),
        },
      };
    }

    // 총 개수 조회
    const total = await this.prisma.transaction.count({ where });

    // 거래 목록 조회
    const transactions = await this.prisma.transaction.findMany({
      where,
      include: {
        supplier: {
          select: {
            id: true,
            companyName: true,
            contactPerson: true,
            phone: true,
          },
        },
        transactionItems: {
          include: {
            product: {
              select: {
                id: true,
                productName: true,
                productCode: true,
                unitPrice: true,
              },
            },
          },
        },
      },
      orderBy: { transactionDate: 'desc' },
      skip,
      take: limit,
    });

    return {
      data: transactions.map(transaction => ({
        ...transaction,
        id: transaction.id.toString(),
        supplierId: transaction.supplierId?.toString(),
        createdBy: transaction.createdBy.toString(),
        items: transaction.transactionItems.map(item => ({
          ...item,
          id: item.id.toString(),
          transactionId: item.transactionId.toString(),
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

  // 거래 상세 조회
  async findOne(userId: string, id: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
      },
      include: {
        supplier: {
          select: {
            id: true,
            companyName: true,
            contactPerson: true,
            phone: true,
          },
        },
        transactionItems: {
          include: {
            product: {
              select: {
                id: true,
                productName: true,
                productCode: true,
                unitPrice: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('거래를 찾을 수 없습니다');
    }

    return {
      data: {
        ...transaction,
        id: transaction.id.toString(),
        supplierId: transaction.supplierId?.toString(),
        createdBy: transaction.createdBy.toString(),
        items: transaction.transactionItems.map(item => ({
          ...item,
          id: item.id.toString(),
          transactionId: item.transactionId.toString(),
          productId: item.productId.toString(),
          product: {
            ...item.product,
            id: item.product.id.toString(),
          },
        })),
      },
    };
  }

  // 거래 수정
  async update(userId: string, id: number, updateTransactionDto: UpdateTransactionDto) {
    const existingTransaction = await this.prisma.transaction.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
      },
    });

    if (!existingTransaction) {
      throw new NotFoundException('거래를 찾을 수 없습니다');
    }

    const {
      transactionType,
      transactionDate,
      supplierId,
      customerName,
      customerPhone,
      status,
      notes,
      items,
    } = updateTransactionDto;

    return this.prisma.$transaction(async (prisma) => {
      // 거래 정보 수정
      const updateData: any = {};

      if (transactionType !== undefined) updateData.transactionType = transactionType;
      if (transactionDate !== undefined) updateData.transactionDate = new Date(transactionDate);
      if (supplierId !== undefined) updateData.supplierId = supplierId ? BigInt(supplierId) : null;
      if (customerName !== undefined) updateData.customerName = customerName;
      if (customerPhone !== undefined) updateData.customerPhone = customerPhone;
      if (status !== undefined) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes;

      // 품목 정보가 있으면 금액 재계산
      if (items && items.length > 0) {
        let subtotalAmount = 0;
        const processedItems = items.map(item => {
          const totalPrice = item.quantity * item.unitPrice;
          subtotalAmount += totalPrice;
          return {
            ...item,
            totalPrice,
          };
        });

        const vatAmount = Math.round(subtotalAmount * 0.1);
        const totalAmount = subtotalAmount + vatAmount;

        updateData.subtotalAmount = subtotalAmount;
        updateData.vatAmount = vatAmount;
        updateData.totalAmount = totalAmount;

        // 기존 품목 삭제 후 새로 생성
        await prisma.transactionItem.deleteMany({
          where: { transactionId: BigInt(id) },
        });

        await Promise.all(
          processedItems.map(item =>
            prisma.transactionItem.create({
              data: {
                transactionId: BigInt(id),
                productId: BigInt(item.productId),
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
              },
            })
          )
        );
      }

      const updatedTransaction = await prisma.transaction.update({
        where: { id: BigInt(id) },
        data: updateData,
        include: {
          transactionItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return {
        ...updatedTransaction,
        id: updatedTransaction.id.toString(),
        supplierId: updatedTransaction.supplierId?.toString(),
        createdBy: updatedTransaction.createdBy.toString(),
      };
    });
  }

  // 거래 삭제
  async remove(userId: string, id: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
      },
    });

    if (!transaction) {
      throw new NotFoundException('거래를 찾을 수 없습니다');
    }

    await this.prisma.transaction.delete({
      where: { id: BigInt(id) },
    });

    return {
      success: true,
      message: '거래가 성공적으로 삭제되었습니다',
    };
  }

  // 거래 상태 변경
  async updateStatus(userId: string, id: number, status: TransactionStatus) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
      },
    });

    if (!transaction) {
      throw new NotFoundException('거래를 찾을 수 없습니다');
    }

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: BigInt(id) },
      data: { status },
    });

    return {
      ...updatedTransaction,
      id: updatedTransaction.id.toString(),
      supplierId: updatedTransaction.supplierId?.toString(),
      createdBy: updatedTransaction.createdBy.toString(),
    };
  }

  // 거래 통계
  async getStats(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        createdBy: BigInt(userId),
        status: TransactionStatus.CONFIRMED,
      },
    });

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const thisMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transactionDate);
      return transactionDate.getMonth() + 1 === currentMonth &&
             transactionDate.getFullYear() === currentYear;
    });

    const totalSales = transactions
      .filter(t => t.transactionType === TransactionType.SALE)
      .reduce((sum, t) => sum + Number(t.totalAmount), 0);

    const totalPurchases = transactions
      .filter(t => t.transactionType === TransactionType.PURCHASE)
      .reduce((sum, t) => sum + Number(t.totalAmount), 0);

    const thisMonthSales = thisMonthTransactions
      .filter(t => t.transactionType === TransactionType.SALE)
      .reduce((sum, t) => sum + Number(t.totalAmount), 0);

    const thisMonthPurchases = thisMonthTransactions
      .filter(t => t.transactionType === TransactionType.PURCHASE)
      .reduce((sum, t) => sum + Number(t.totalAmount), 0);

    const totalProfit = totalSales - totalPurchases;
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

    const pendingCount = await this.prisma.transaction.count({
      where: {
        createdBy: BigInt(userId),
        status: TransactionStatus.PENDING,
      },
    });

    const totalCount = await this.prisma.transaction.count({
      where: {
        createdBy: BigInt(userId),
      },
    });

    return {
      totalSales,
      totalPurchases,
      totalProfit,
      profitMargin,
      thisMonthSales,
      thisMonthPurchases,
      pendingTransactionsCount: pendingCount,
      totalTransactionsCount: totalCount,
    };
  }

  // 월별 통계
  async getMonthlyStats(userId: string) {
    // 지난 12개월간의 월별 통계
    const transactions = await this.prisma.transaction.findMany({
      where: {
        createdBy: BigInt(userId),
        status: TransactionStatus.CONFIRMED,
        transactionDate: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 11)),
        },
      },
    });

    const monthlyStats = new Map();

    transactions.forEach(transaction => {
      const monthKey = transaction.transactionDate.toISOString().slice(0, 7); // YYYY-MM

      if (!monthlyStats.has(monthKey)) {
        monthlyStats.set(monthKey, {
          month: monthKey,
          salesAmount: 0,
          purchaseAmount: 0,
          profit: 0,
          transactionCount: 0,
        });
      }

      const stats = monthlyStats.get(monthKey);
      const amount = Number(transaction.totalAmount);

      if (transaction.transactionType === TransactionType.SALE) {
        stats.salesAmount += amount;
      } else {
        stats.purchaseAmount += amount;
      }

      stats.profit = stats.salesAmount - stats.purchaseAmount;
      stats.transactionCount += 1;
    });

    return Array.from(monthlyStats.values()).sort((a, b) => a.month.localeCompare(b.month));
  }

  // 거래처별 통계
  async getPartnerStats(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        createdBy: BigInt(userId),
        status: TransactionStatus.CONFIRMED,
      },
      include: {
        supplier: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });

    const partnerStats = new Map();

    transactions.forEach(transaction => {
      let partnerId, partnerName;

      if (transaction.transactionType === TransactionType.PURCHASE && transaction.supplier) {
        partnerId = transaction.supplier.id.toString();
        partnerName = transaction.supplier.companyName;
      } else if (transaction.transactionType === TransactionType.SALE && transaction.customerName) {
        partnerId = `customer_${transaction.customerName}`;
        partnerName = transaction.customerName;
      } else {
        return;
      }

      if (!partnerStats.has(partnerId)) {
        partnerStats.set(partnerId, {
          partnerId,
          partnerName,
          transactionType: transaction.transactionType,
          totalAmount: 0,
          transactionCount: 0,
          lastTransactionDate: transaction.transactionDate,
        });
      }

      const stats = partnerStats.get(partnerId);
      stats.totalAmount += Number(transaction.totalAmount);
      stats.transactionCount += 1;

      if (transaction.transactionDate > stats.lastTransactionDate) {
        stats.lastTransactionDate = transaction.transactionDate;
      }
    });

    return Array.from(partnerStats.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }

  // 상품별 거래 통계
  async getProductStats(userId: string) {
    const transactionItems = await this.prisma.transactionItem.findMany({
      where: {
        transaction: {
          createdBy: BigInt(userId),
          status: TransactionStatus.CONFIRMED,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            productName: true,
          },
        },
        transaction: {
          select: {
            transactionType: true,
          },
        },
      },
    });

    const productStats = new Map();

    transactionItems.forEach(item => {
      const productId = item.product.id.toString();

      if (!productStats.has(productId)) {
        productStats.set(productId, {
          productId,
          productName: item.product.productName,
          totalQuantitySold: 0,
          totalQuantityPurchased: 0,
          totalSalesAmount: 0,
          totalPurchaseAmount: 0,
          profit: 0,
          profitMargin: 0,
        });
      }

      const stats = productStats.get(productId);
      const amount = Number(item.totalPrice);

      if (item.transaction.transactionType === TransactionType.SALE) {
        stats.totalQuantitySold += item.quantity;
        stats.totalSalesAmount += amount;
      } else {
        stats.totalQuantityPurchased += item.quantity;
        stats.totalPurchaseAmount += amount;
      }

      stats.profit = stats.totalSalesAmount - stats.totalPurchaseAmount;
      stats.profitMargin = stats.totalSalesAmount > 0 ? (stats.profit / stats.totalSalesAmount) * 100 : 0;
    });

    return Array.from(productStats.values()).sort((a, b) => b.totalSalesAmount - a.totalSalesAmount);
  }

  // 거래 복제
  async duplicate(userId: string, id: number) {
    const originalTransaction = await this.findOne(userId, id);

    const createDto: CreateTransactionDto = {
      transactionType: originalTransaction.data.transactionType,
      transactionDate: new Date().toISOString().slice(0, 10),
      supplierId: originalTransaction.data.supplierId ? Number(originalTransaction.data.supplierId) : undefined,
      customerName: originalTransaction.data.customerName || undefined,
      customerPhone: originalTransaction.data.customerPhone || undefined,
      notes: `[복제] ${originalTransaction.data.notes || ''}`,
      items: originalTransaction.data.items.map(item => ({
        productId: Number(item.productId),
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      })),
    };

    return this.create(userId, createDto);
  }

  // 거래 승인
  async approve(userId: string, id: number) {
    return this.updateStatus(userId, id, TransactionStatus.CONFIRMED);
  }

  // 거래 반려
  async reject(userId: string, id: number, reason?: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: BigInt(id),
        createdBy: BigInt(userId),
      },
    });

    if (!transaction) {
      throw new NotFoundException('거래를 찾을 수 없습니다');
    }

    const updatedNotes = reason
      ? `${transaction.notes || ''}\n[반려 사유] ${reason}`
      : transaction.notes;

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: BigInt(id) },
      data: {
        status: TransactionStatus.CANCELLED,
        notes: updatedNotes,
      },
    });

    return {
      ...updatedTransaction,
      id: updatedTransaction.id.toString(),
      supplierId: updatedTransaction.supplierId?.toString(),
      createdBy: updatedTransaction.createdBy.toString(),
    };
  }
}