import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';

describe('Orders (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;
  let supplierId: string;
  let productId1: string;
  let productId2: string;

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: '테스트 사용자',
    companyName: '테스트 회사',
  };

  const testSupplier = {
    companyName: '테스트 공급업체',
    supplierCode: 'SUP001',
    contactPerson: '담당자',
    phone: '010-1234-5678',
    email: 'supplier@example.com',
    location: '서울시 강남구',
    description: '테스트용 공급업체',
  };

  const testCategory = {
    categoryName: '전자제품',
    description: '전자제품 카테고리',
  };

  const testProducts = [
    {
      productCode: 'PRD001',
      productName: '테스트 상품 1',
      description: '테스트용 상품 1',
      unitPrice: 10000,
      stockQuantity: 100,
      minStockLevel: 10,
      isActive: true,
    },
    {
      productCode: 'PRD002',
      productName: '테스트 상품 2',
      description: '테스트용 상품 2',
      unitPrice: 20000,
      stockQuantity: 50,
      minStockLevel: 5,
      isActive: true,
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await cleanupDatabase();
    await setupTestData();
  });

  afterEach(async () => {
    await cleanupDatabase();
    await app.close();
  });

  async function cleanupDatabase() {
    await prisma.refreshToken.deleteMany();
    await prisma.purchaseOrderItem.deleteMany();
    await prisma.purchaseOrder.deleteMany();
    await prisma.stockMovement.deleteMany();
    await prisma.product.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.categories.deleteMany();
    await prisma.user.deleteMany();
  }

  async function setupTestData() {
    // 사용자 등록 및 로그인
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    userId = registerResponse.body.data.user.id;

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    accessToken = loginResponse.body.data.accessToken;

    // 카테고리 생성
    const categoryResponse = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(testCategory);

    const categoryId = categoryResponse.body.data.id;

    // 공급업체 생성
    const supplierResponse = await request(app.getHttpServer())
      .post('/suppliers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(testSupplier);

    supplierId = supplierResponse.body.data.id;

    // 상품들 생성
    const product1Response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        ...testProducts[0],
        categoryId,
        supplierId,
      });

    productId1 = product1Response.body.data.id;

    const product2Response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        ...testProducts[1],
        categoryId,
        supplierId,
      });

    productId2 = product2Response.body.data.id;
  }

  describe('POST /orders', () => {
    it('should create a new order successfully', async () => {
      const orderData = {
        supplierId,
        items: [
          {
            productId: productId1,
            quantity: 10,
            unitPrice: 10000,
          },
          {
            productId: productId2,
            quantity: 5,
            unitPrice: 20000,
          },
        ],
        expectedDeliveryDate: '2025-01-15',
        notes: '테스트 주문',
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: '주문이 생성되었습니다',
        data: {
          order: {
            supplierId,
            status: 'PENDING',
            totalAmount: 200000, // (10 * 10000) + (5 * 20000)
            notes: '테스트 주문',
            orderNumber: expect.stringMatching(/^PO\d{8}\d{3}$/), // PO + 날짜 + 순번
          },
          items: expect.arrayContaining([
            expect.objectContaining({
              productId: productId1,
              quantity: 10,
              unitPrice: 10000,
              totalPrice: 100000,
            }),
            expect.objectContaining({
              productId: productId2,
              quantity: 5,
              unitPrice: 20000,
              totalPrice: 100000,
            }),
          ]),
        },
      });

      expect(response.body.data.order.id).toBeDefined();
      expect(response.body.data.items).toHaveLength(2);
    });

    it('should create order with default unit prices from products', async () => {
      const orderData = {
        supplierId,
        items: [
          {
            productId: productId1,
            quantity: 5,
            // unitPrice 생략 - 상품의 기본 가격 사용
          },
        ],
        notes: '기본 가격 사용 주문',
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body.data.order.totalAmount).toBe(50000); // 5 * 10000
      expect(response.body.data.items[0].unitPrice).toBe(10000);
    });

    it('should fail with non-existent supplier', async () => {
      const orderData = {
        supplierId: '999999',
        items: [
          {
            productId: productId1,
            quantity: 10,
            unitPrice: 10000,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(orderData)
        .expect(404);
    });

    it('should fail with non-existent product', async () => {
      const orderData = {
        supplierId,
        items: [
          {
            productId: '999999',
            quantity: 10,
            unitPrice: 10000,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(orderData)
        .expect(404);
    });

    it('should fail with invalid quantity', async () => {
      const orderData = {
        supplierId,
        items: [
          {
            productId: productId1,
            quantity: -5, // 음수 수량
            unitPrice: 10000,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(orderData)
        .expect(400);
    });

    it('should fail without authentication', async () => {
      const orderData = {
        supplierId,
        items: [
          {
            productId: productId1,
            quantity: 10,
            unitPrice: 10000,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/orders')
        .send(orderData)
        .expect(401);
    });
  });

  describe('GET /orders', () => {
    let orderId1: string;
    let orderId2: string;

    beforeEach(async () => {
      // 테스트용 주문들 생성
      const order1Response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          supplierId,
          items: [
            {
              productId: productId1,
              quantity: 10,
              unitPrice: 10000,
            },
          ],
          notes: '첫 번째 주문',
        });

      orderId1 = order1Response.body.data.order.id;

      const order2Response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          supplierId,
          items: [
            {
              productId: productId2,
              quantity: 5,
              unitPrice: 20000,
            },
          ],
          notes: '두 번째 주문',
        });

      orderId2 = order2Response.body.data.order.id;
    });

    it('should get orders list with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: '주문 목록 조회 성공',
        data: expect.arrayContaining([
          expect.objectContaining({
            id: orderId1,
            status: 'PENDING',
            totalAmount: 100000,
          }),
          expect.objectContaining({
            id: orderId2,
            status: 'PENDING',
            totalAmount: 100000,
          }),
        ]),
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });

      expect(response.body.data).toHaveLength(2);
    });

    it('should filter orders by status', async () => {
      // 주문 상태 변경
      await request(app.getHttpServer())
        .patch(`/orders/${orderId1}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'CONFIRMED' });

      const response = await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ status: 'CONFIRMED' })
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('CONFIRMED');
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get('/orders')
        .expect(401);
    });
  });

  describe('GET /orders/:id', () => {
    let orderId: string;

    beforeEach(async () => {
      const orderResponse = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          supplierId,
          items: [
            {
              productId: productId1,
              quantity: 10,
              unitPrice: 10000,
            },
            {
              productId: productId2,
              quantity: 5,
              unitPrice: 20000,
            },
          ],
          expectedDeliveryDate: '2025-01-15',
          notes: '상세 조회용 주문',
        });

      orderId = orderResponse.body.data.order.id;
    });

    it('should get order details with items and supplier info', async () => {
      const response = await request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: orderId,
          status: 'PENDING',
          totalAmount: 200000,
          notes: '상세 조회용 주문',
          supplier: {
            id: supplierId,
            companyName: testSupplier.companyName,
            contactPerson: testSupplier.contactPerson,
            phone: testSupplier.phone,
            email: testSupplier.email,
          },
          items: expect.arrayContaining([
            expect.objectContaining({
              productId: productId1,
              quantity: 10,
              unitPrice: 10000,
              totalPrice: 100000,
              product: {
                productCode: testProducts[0].productCode,
                productName: testProducts[0].productName,
              },
            }),
            expect.objectContaining({
              productId: productId2,
              quantity: 5,
              unitPrice: 20000,
              totalPrice: 100000,
              product: {
                productCode: testProducts[1].productCode,
                productName: testProducts[1].productName,
              },
            }),
          ]),
        },
      });

      expect(response.body.data.items).toHaveLength(2);
    });

    it('should fail with non-existent order ID', async () => {
      await request(app.getHttpServer())
        .get('/orders/999999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .expect(401);
    });
  });

  describe('PATCH /orders/:id', () => {
    let orderId: string;

    beforeEach(async () => {
      const orderResponse = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          supplierId,
          items: [
            {
              productId: productId1,
              quantity: 10,
              unitPrice: 10000,
            },
          ],
          notes: '수정할 주문',
        });

      orderId = orderResponse.body.data.order.id;
    });

    it('should update order status successfully', async () => {
      const updateData = {
        status: 'CONFIRMED',
        notes: '수정된 주문 메모',
        expectedDeliveryDate: '2025-01-20',
      };

      const response = await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: '주문이 수정되었습니다',
        data: {
          id: orderId,
          status: 'CONFIRMED',
          notes: '수정된 주문 메모',
        },
      });
    });

    it('should update order items and recalculate total', async () => {
      const updateData = {
        items: [
          {
            productId: productId1,
            quantity: 15, // 수량 변경
            unitPrice: 12000, // 가격 변경
          },
          {
            productId: productId2,
            quantity: 3,
            unitPrice: 18000,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.order.totalAmount).toBe(234000); // (15 * 12000) + (3 * 18000)
      expect(response.body.data.items).toHaveLength(2);
    });

    it('should fail to update cancelled order', async () => {
      // 주문을 먼저 취소 상태로 변경
      await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'CANCELLED' });

      // 취소된 주문 수정 시도
      await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ notes: '취소된 주문 수정 시도' })
        .expect(400);
    });

    it('should fail with invalid status', async () => {
      await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'INVALID_STATUS' })
        .expect(400);
    });

    it('should fail with non-existent order ID', async () => {
      await request(app.getHttpServer())
        .patch('/orders/999999')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'CONFIRMED' })
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .send({ status: 'CONFIRMED' })
        .expect(401);
    });
  });

  describe('DELETE /orders/:id', () => {
    let orderId: string;

    beforeEach(async () => {
      const orderResponse = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          supplierId,
          items: [
            {
              productId: productId1,
              quantity: 10,
              unitPrice: 10000,
            },
          ],
          notes: '삭제할 주문',
        });

      orderId = orderResponse.body.data.order.id;
    });

    it('should delete order successfully', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: '주문이 삭제되었습니다',
      });

      // 삭제 확인
      await request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should fail to delete delivered order', async () => {
      // 주문을 먼저 배송 완료 상태로 변경
      await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'DELIVERED' });

      // 배송 완료된 주문 삭제 시도
      await request(app.getHttpServer())
        .delete(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should fail with non-existent order ID', async () => {
      await request(app.getHttpServer())
        .delete('/orders/999999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/orders/${orderId}`)
        .expect(401);
    });
  });

  describe('GET /orders/stats', () => {
    beforeEach(async () => {
      // 다양한 상태의 주문들 생성
      const orderStates = ['PENDING', 'CONFIRMED', 'DELIVERED'];

      for (const status of orderStates) {
        const orderResponse = await request(app.getHttpServer())
          .post('/orders')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            supplierId,
            items: [
              {
                productId: productId1,
                quantity: 10,
                unitPrice: 10000,
              },
            ],
            notes: `${status} 상태 주문`,
          });

        if (status !== 'PENDING') {
          await request(app.getHttpServer())
            .patch(`/orders/${orderResponse.body.data.order.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ status });
        }
      }
    });

    it('should get order statistics', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders/stats')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: '주문 통계 조회 성공',
        data: {
          totalOrders: 3,
          pendingOrders: 1,
          confirmedOrders: 1,
          deliveredOrders: 1,
          monthlyOrderValue: expect.any(Number),
        },
      });

      expect(response.body.data.monthlyOrderValue).toBeGreaterThan(0);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get('/orders/stats')
        .expect(401);
    });
  });

  describe('Order Management Flow Integration', () => {
    it('should complete full order lifecycle: create → confirm → ship → deliver', async () => {
      // 1. 주문 생성
      const createResponse = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          supplierId,
          items: [
            {
              productId: productId1,
              quantity: 10,
              unitPrice: 10000,
            },
            {
              productId: productId2,
              quantity: 5,
              unitPrice: 20000,
            },
          ],
          expectedDeliveryDate: '2025-01-15',
          notes: '통합 테스트 주문',
        })
        .expect(201);

      const orderId = createResponse.body.data.order.id;
      expect(createResponse.body.data.order.status).toBe('PENDING');

      // 2. 주문 확인 (PENDING → CONFIRMED)
      const confirmResponse = await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          status: 'CONFIRMED',
          notes: '주문 확인됨',
        })
        .expect(200);

      expect(confirmResponse.body.data.status).toBe('CONFIRMED');

      // 3. 배송 시작 (CONFIRMED → SHIPPED)
      const shipResponse = await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          status: 'SHIPPED',
          notes: '배송 시작',
        })
        .expect(200);

      expect(shipResponse.body.data.status).toBe('SHIPPED');

      // 4. 배송 완료 (SHIPPED → DELIVERED)
      const deliverResponse = await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          status: 'DELIVERED',
          notes: '배송 완료',
        })
        .expect(200);

      expect(deliverResponse.body.data.status).toBe('DELIVERED');

      // 5. 최종 주문 상세 정보 확인
      const finalOrderResponse = await request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(finalOrderResponse.body.data).toMatchObject({
        id: orderId,
        status: 'DELIVERED',
        totalAmount: 200000,
        notes: '배송 완료',
        supplier: {
          companyName: testSupplier.companyName,
        },
        items: expect.arrayContaining([
          expect.objectContaining({
            productId: productId1,
            quantity: 10,
            totalPrice: 100000,
          }),
          expect.objectContaining({
            productId: productId2,
            quantity: 5,
            totalPrice: 100000,
          }),
        ]),
      });

      // 6. 배송 완료된 주문은 삭제 불가 확인
      await request(app.getHttpServer())
        .delete(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      // 7. 주문 통계에 반영 확인
      const statsResponse = await request(app.getHttpServer())
        .get('/orders/stats')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(statsResponse.body.data.totalOrders).toBeGreaterThanOrEqual(1);
      expect(statsResponse.body.data.deliveredOrders).toBeGreaterThanOrEqual(1);
    });

    it('should handle order cancellation flow', async () => {
      // 1. 주문 생성
      const createResponse = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          supplierId,
          items: [
            {
              productId: productId1,
              quantity: 5,
              unitPrice: 10000,
            },
          ],
          notes: '취소할 주문',
        })
        .expect(201);

      const orderId = createResponse.body.data.order.id;

      // 2. 주문 취소 (PENDING → CANCELLED)
      const cancelResponse = await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          status: 'CANCELLED',
          notes: '고객 요청으로 주문 취소',
        })
        .expect(200);

      expect(cancelResponse.body.data.status).toBe('CANCELLED');

      // 3. 취소된 주문은 수정 불가 확인
      await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          status: 'CONFIRMED',
          notes: '취소된 주문 수정 시도',
        })
        .expect(400);

      // 4. 취소된 주문은 삭제 가능 확인
      await request(app.getHttpServer())
        .delete(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});