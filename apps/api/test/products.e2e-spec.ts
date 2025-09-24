import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Products (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;
  let categoryId: string;
  let supplierId: string;

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: '테스트 사용자',
    companyName: '테스트 회사',
  };

  const testCategory = {
    categoryName: '전자제품',
    description: '전자제품 카테고리',
  };

  const testSupplier = {
    companyName: '테스트 거래처',
    supplierCode: 'SUP001',
    contactPerson: '담당자',
    phone: '010-1234-5678',
    email: 'supplier@example.com',
    location: '서울시 강남구',
    description: '테스트용 거래처',
  };

  const testProduct = {
    productCode: 'PRD001',
    productName: '테스트 상품',
    description: '테스트용 상품',
    unitPrice: 10000,
    stockQuantity: 100,
    minStockLevel: 10,
    isActive: true,
  };

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

    // 테스트용 사용자 생성 및 인증 토큰 획득
    await setupTestUser();
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
    await prisma.productCategory.deleteMany();
    await prisma.user.deleteMany();
  }

  async function setupTestUser() {
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

    // 테스트용 카테고리 생성
    const categoryResponse = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(testCategory);

    categoryId = categoryResponse.body.data.id;

    // 테스트용 거래처 생성
    const supplierResponse = await request(app.getHttpServer())
      .post('/suppliers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(testSupplier);

    supplierId = supplierResponse.body.data.id;
  }

  describe('POST /products', () => {
    it('should create a new product successfully', async () => {
      const productData = {
        ...testProduct,
        categoryId,
        supplierId,
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(productData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: '상품이 등록되었습니다',
        data: {
          productCode: testProduct.productCode,
          productName: testProduct.productName,
          description: testProduct.description,
          unitPrice: testProduct.unitPrice,
          stockQuantity: testProduct.stockQuantity,
          minStockLevel: testProduct.minStockLevel,
          isActive: testProduct.isActive,
          categoryId,
          supplierId,
        },
      });

      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
    });

    it('should fail with duplicate product code', async () => {
      const productData = {
        ...testProduct,
        categoryId,
        supplierId,
      };

      // 첫 번째 상품 생성
      await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(productData)
        .expect(201);

      // 동일한 상품 코드로 두 번째 상품 생성 시도
      await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(productData)
        .expect(409); // Conflict
    });

    it('should fail with invalid category ID', async () => {
      const productData = {
        ...testProduct,
        categoryId: '999999',
        supplierId,
      };

      await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(productData)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      const productData = {
        ...testProduct,
        categoryId,
        supplierId,
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(productData)
        .expect(401);
    });

    it('should fail with invalid data', async () => {
      const invalidProductData = {
        ...testProduct,
        unitPrice: -1000, // 음수 가격
        categoryId,
        supplierId,
      };

      await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidProductData)
        .expect(400);
    });
  });

  describe('GET /products', () => {
    let productId: string;

    beforeEach(async () => {
      // 테스트용 상품들 생성
      const products = [
        { ...testProduct, productCode: 'PRD001', productName: '상품 1' },
        { ...testProduct, productCode: 'PRD002', productName: '상품 2' },
        { ...testProduct, productCode: 'PRD003', productName: '상품 3' },
      ];

      for (const product of products) {
        const response = await request(app.getHttpServer())
          .post('/products')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            ...product,
            categoryId,
            supplierId,
          });

        if (!productId) {
          productId = response.body.data.id;
        }
      }
    });

    it('should get products list with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: '상품 목록 조회 성공',
        data: expect.arrayContaining([
          expect.objectContaining({
            productCode: expect.any(String),
            productName: expect.any(String),
            unitPrice: expect.any(Number),
            stockQuantity: expect.any(Number),
          }),
        ]),
        pagination: {
          page: 1,
          limit: 2,
          total: 3,
          totalPages: 2,
        },
      });

      expect(response.body.data).toHaveLength(2);
    });

    it('should search products by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ search: '상품 1' })
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].productName).toBe('상품 1');
    });

    it('should filter products by category', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ categoryId })
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      response.body.data.forEach((product: any) => {
        expect(product.categoryId).toBe(categoryId);
      });
    });

    it('should get low stock products', async () => {
      // 재고가 부족한 상품 생성
      await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...testProduct,
          productCode: 'PRD004',
          productName: '재고 부족 상품',
          stockQuantity: 5, // minStockLevel(10)보다 적음
          categoryId,
          supplierId,
        });

      const response = await request(app.getHttpServer())
        .get('/products/low-stock')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
      response.body.data.forEach((product: any) => {
        expect(product.stockQuantity).toBeLessThanOrEqual(
          product.minStockLevel,
        );
      });
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer()).get('/products').expect(401);
    });
  });

  describe('GET /products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...testProduct,
          categoryId,
          supplierId,
        });

      productId = response.body.data.id;
    });

    it('should get product details', async () => {
      const response = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: productId,
          productCode: testProduct.productCode,
          productName: testProduct.productName,
          description: testProduct.description,
          unitPrice: testProduct.unitPrice,
          stockQuantity: testProduct.stockQuantity,
          category: {
            id: categoryId,
            categoryName: testCategory.categoryName,
          },
          supplier: {
            id: supplierId,
            companyName: testSupplier.companyName,
          },
        },
      });
    });

    it('should fail with non-existent product ID', async () => {
      await request(app.getHttpServer())
        .get('/products/999999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(401);
    });
  });

  describe('PATCH /products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...testProduct,
          categoryId,
          supplierId,
        });

      productId = response.body.data.id;
    });

    it('should update product successfully', async () => {
      const updateData = {
        productName: '수정된 상품명',
        unitPrice: 15000,
        description: '수정된 설명',
      };

      const response = await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: '상품이 수정되었습니다',
        data: {
          id: productId,
          productName: updateData.productName,
          unitPrice: updateData.unitPrice,
          description: updateData.description,
        },
      });
    });

    it('should fail with invalid data', async () => {
      const invalidUpdateData = {
        unitPrice: -5000, // 음수 가격
      };

      await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidUpdateData)
        .expect(400);
    });

    it('should fail with non-existent product ID', async () => {
      await request(app.getHttpServer())
        .patch('/products/999999')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ productName: '수정된 이름' })
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send({ productName: '수정된 이름' })
        .expect(401);
    });
  });

  describe('POST /products/:id/stock', () => {
    let productId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...testProduct,
          categoryId,
          supplierId,
        });

      productId = response.body.data.id;
    });

    it('should adjust stock successfully', async () => {
      const stockAdjustment = {
        quantity: 50,
        type: 'in', // 입고
        reason: '재고 조정',
      };

      const response = await request(app.getHttpServer())
        .post(`/products/${productId}/stock`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(stockAdjustment)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: '재고가 조정되었습니다',
      });

      // 재고 변경 확인
      const productResponse = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(productResponse.body.data.stockQuantity).toBe(
        testProduct.stockQuantity + stockAdjustment.quantity,
      );
    });

    it('should handle stock out adjustment', async () => {
      const stockAdjustment = {
        quantity: 30,
        type: 'out', // 출고
        reason: '판매',
      };

      const response = await request(app.getHttpServer())
        .post(`/products/${productId}/stock`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(stockAdjustment)
        .expect(200);

      expect(response.body.success).toBe(true);

      // 재고 감소 확인
      const productResponse = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(productResponse.body.data.stockQuantity).toBe(
        testProduct.stockQuantity - stockAdjustment.quantity,
      );
    });

    it('should fail with insufficient stock for out adjustment', async () => {
      const stockAdjustment = {
        quantity: 200, // 현재 재고(100)보다 많음
        type: 'out',
        reason: '과다 출고',
      };

      await request(app.getHttpServer())
        .post(`/products/${productId}/stock`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(stockAdjustment)
        .expect(400);
    });

    it('should fail with invalid adjustment type', async () => {
      const invalidAdjustment = {
        quantity: 50,
        type: 'invalid',
        reason: '테스트',
      };

      await request(app.getHttpServer())
        .post(`/products/${productId}/stock`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidAdjustment)
        .expect(400);
    });
  });

  describe('DELETE /products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...testProduct,
          categoryId,
          supplierId,
        });

      productId = response.body.data.id;
    });

    it('should delete product successfully', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: '상품이 삭제되었습니다',
      });

      // 삭제 확인
      await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should fail with non-existent product ID', async () => {
      await request(app.getHttpServer())
        .delete('/products/999999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .expect(401);
    });
  });

  describe('Product Management Flow Integration', () => {
    it('should complete full product lifecycle: create → list → update → stock adjustment → delete', async () => {
      // 1. 상품 생성
      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...testProduct,
          categoryId,
          supplierId,
        })
        .expect(201);

      const productId = createResponse.body.data.id;
      expect(createResponse.body.success).toBe(true);

      // 2. 상품 목록에서 확인
      const listResponse = await request(app.getHttpServer())
        .get('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(listResponse.body.data).toHaveLength(1);
      expect(listResponse.body.data[0].id).toBe(productId);

      // 3. 상품 정보 수정
      const updateResponse = await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          productName: '수정된 상품명',
          unitPrice: 20000,
        })
        .expect(200);

      expect(updateResponse.body.data.productName).toBe('수정된 상품명');
      expect(updateResponse.body.data.unitPrice).toBe(20000);

      // 4. 재고 입고
      await request(app.getHttpServer())
        .post(`/products/${productId}/stock`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          quantity: 50,
          type: 'in',
          reason: '추가 입고',
        })
        .expect(200);

      // 5. 재고 출고
      await request(app.getHttpServer())
        .post(`/products/${productId}/stock`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          quantity: 30,
          type: 'out',
          reason: '판매',
        })
        .expect(200);

      // 6. 최종 재고 확인
      const finalProductResponse = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(finalProductResponse.body.data.stockQuantity).toBe(120); // 100 + 50 - 30

      // 7. 상품 삭제
      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // 8. 삭제 확인
      await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
