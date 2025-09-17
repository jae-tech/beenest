import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 ERP 시드 데이터 생성 시작...');

  // 기존 데이터 정리 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    await prisma.supplierProduct.deleteMany();
    await prisma.stockMovement.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.user.deleteMany();
    console.log('🗑️  기존 데이터 정리 완료');
  }

  // 관리자 사용자 생성
  const hashedPassword = await bcrypt.hash('admin123!', 12);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@beenest.com',
      passwordHash: hashedPassword,
      name: '시스템 관리자',
      role: 'admin',
      isActive: true,
    },
  });

  // 일반 사용자 생성
  const userPassword = await bcrypt.hash('user123!', 12);
  const generalUser = await prisma.user.create({
    data: {
      email: 'user@beenest.com',
      passwordHash: userPassword,
      name: '김재고',
      role: 'user',
      isActive: true,
    },
  });

  console.log('👤 사용자 생성 완료:', `${adminUser.email}, ${generalUser.email}`);

  // 상품 카테고리 생성 (계층 구조)
  const electronicsCategory = await prisma.productCategory.create({
    data: {
      categoryName: '전자제품',
      displayOrder: 1,
    },
  });

  const computerCategory = await prisma.productCategory.create({
    data: {
      categoryName: '컴퓨터/노트북',
      parentCategoryId: electronicsCategory.id,
      displayOrder: 1,
    },
  });

  const accessoryCategory = await prisma.productCategory.create({
    data: {
      categoryName: '액세서리',
      parentCategoryId: electronicsCategory.id,
      displayOrder: 2,
    },
  });

  const fashionCategory = await prisma.productCategory.create({
    data: {
      categoryName: '패션',
      displayOrder: 2,
    },
  });

  const clothingCategory = await prisma.productCategory.create({
    data: {
      categoryName: '의류',
      parentCategoryId: fashionCategory.id,
      displayOrder: 1,
    },
  });

  console.log('📂 카테고리 생성 완료');

  // 공급업체 생성
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        supplierCode: 'SUP001',
        companyName: '테크노 일렉트로닉스 주식회사',
        contactPerson: '김기술',
        email: 'kim.tech@techno-electronics.co.kr',
        phone: '02-1234-5678',
        mobile: '010-1234-5678',
        businessRegistration: '123-45-67890',
        taxId: 'KR1234567890123',
        addressLine1: '서울특별시 강남구 테헤란로 123',
        city: '서울',
        stateProvince: '서울특별시',
        postalCode: '06142',
        paymentTerms: '월말 결제',
        creditLimit: 50000000,
        rating: 5,
        supplierStatus: 'active',
        createdBy: adminUser.id,
      },
    }),
    prisma.supplier.create({
      data: {
        supplierCode: 'SUP002',
        companyName: '패션플러스',
        contactPerson: '이스타일',
        email: 'style@fashionplus.co.kr',
        phone: '031-987-6543',
        mobile: '010-9876-5432',
        businessRegistration: '987-65-43210',
        addressLine1: '경기도 성남시 분당구 판교역로 456',
        city: '성남시',
        stateProvince: '경기도',
        postalCode: '13494',
        paymentTerms: '15일 결제',
        creditLimit: 30000000,
        rating: 4,
        supplierStatus: 'active',
        createdBy: adminUser.id,
      },
    }),
    prisma.supplier.create({
      data: {
        supplierCode: 'SUP003',
        companyName: '스포츠월드',
        contactPerson: '박운동',
        email: 'sports@sportsworld.co.kr',
        phone: '051-555-1234',
        mobile: '010-5555-1234',
        businessRegistration: '555-12-34567',
        addressLine1: '부산광역시 해운대구 센텀중앙로 789',
        city: '부산',
        stateProvince: '부산광역시',
        postalCode: '48058',
        paymentTerms: '현금 결제',
        creditLimit: 20000000,
        rating: 4,
        supplierStatus: 'active',
        createdBy: adminUser.id,
      },
    }),
  ]);
  console.log('🏢 공급업체 생성 완료:', suppliers.length + '개');

  // 상품 생성
  const products = await Promise.all([
    prisma.product.create({
      data: {
        productCode: 'PRD001',
        productName: '무선 블루투스 헤드폰 WH-1000XM5',
        description: '업계 최고 수준의 노이즈 캔슬링과 고음질을 자랑하는 프리미엄 헤드폰',
        categoryId: accessoryCategory.id,
        unitPrice: 399000,
        costPrice: 280000,
        barcode: '8801234567890',
        weight: 250,
        dimensions: '20cm x 18cm x 8cm',
        imageUrl: '/images/headphone-wh1000xm5.jpg',
        createdBy: adminUser.id,
      },
    }),
    prisma.product.create({
      data: {
        productCode: 'PRD002',
        productName: '프리미엄 코튼 반팔 티셔츠',
        description: '100% 유기농 코튼으로 제작된 친환경 베이직 티셔츠',
        categoryId: clothingCategory.id,
        unitPrice: 49000,
        costPrice: 25000,
        barcode: '8801234567891',
        weight: 180,
        dimensions: 'M사이즈 기준',
        imageUrl: '/images/cotton-tshirt.jpg',
        createdBy: adminUser.id,
      },
    }),
    prisma.product.create({
      data: {
        productCode: 'PRD003',
        productName: '비즈니스 노트북 백팩 15.6인치',
        description: '15.6인치 노트북과 각종 업무용품을 수납할 수 있는 고급 백팩',
        categoryId: accessoryCategory.id,
        unitPrice: 89000,
        costPrice: 55000,
        barcode: '8801234567892',
        weight: 1200,
        dimensions: '45cm x 30cm x 20cm',
        imageUrl: '/images/laptop-backpack.jpg',
        createdBy: adminUser.id,
      },
    }),
    prisma.product.create({
      data: {
        productCode: 'PRD004',
        productName: '포터블 블루투스 스피커',
        description: '방수 기능과 12시간 연속 재생이 가능한 휴대용 스피커',
        categoryId: accessoryCategory.id,
        unitPrice: 159000,
        costPrice: 95000,
        barcode: '8801234567893',
        weight: 680,
        dimensions: '18cm x 8cm x 7cm',
        imageUrl: '/images/bluetooth-speaker.jpg',
        createdBy: adminUser.id,
      },
    }),
    prisma.product.create({
      data: {
        productCode: 'PRD005',
        productName: '프로 러닝화 에어 맥스',
        description: '최신 에어 쿠셔닝 기술이 적용된 프로페셔널 러닝화',
        categoryId: fashionCategory.id,
        unitPrice: 189000,
        costPrice: 120000,
        barcode: '8801234567894',
        weight: 280,
        dimensions: '270mm (42사이즈 기준)',
        imageUrl: '/images/running-shoes.jpg',
        createdBy: adminUser.id,
      },
    }),
  ]);
  console.log('📦 상품 생성 완료:', products.length + '개');

  // 재고 정보 생성
  const inventories = await Promise.all([
    prisma.inventory.create({
      data: {
        productId: products[0].id,
        currentStock: 150,
        reservedStock: 5,
        minimumStock: 20,
        maximumStock: 300,
        reorderPoint: 30,
      },
    }),
    prisma.inventory.create({
      data: {
        productId: products[1].id,
        currentStock: 8, // 재고 부족
        reservedStock: 2,
        minimumStock: 50,
        maximumStock: 200,
        reorderPoint: 60,
      },
    }),
    prisma.inventory.create({
      data: {
        productId: products[2].id,
        currentStock: 0, // 품절
        reservedStock: 0,
        minimumStock: 15,
        maximumStock: 100,
        reorderPoint: 20,
      },
    }),
    prisma.inventory.create({
      data: {
        productId: products[3].id,
        currentStock: 75,
        reservedStock: 8,
        minimumStock: 25,
        maximumStock: 150,
        reorderPoint: 35,
      },
    }),
    prisma.inventory.create({
      data: {
        productId: products[4].id,
        currentStock: 42,
        reservedStock: 3,
        minimumStock: 30,
        maximumStock: 120,
        reorderPoint: 40,
      },
    }),
  ]);
  console.log('📊 재고 정보 생성 완료');

  // 공급업체-상품 연결 정보
  await Promise.all([
    // 테크노 일렉트로닉스 - 전자제품들
    prisma.supplierProduct.create({
      data: {
        supplierId: suppliers[0].id,
        productId: products[0].id,
        supplierProductCode: 'TECH-WH-001',
        supplierPrice: 280000,
        minimumOrderQty: 10,
        leadTimeDays: 7,
        isPreferred: true,
      },
    }),
    prisma.supplierProduct.create({
      data: {
        supplierId: suppliers[0].id,
        productId: products[3].id,
        supplierProductCode: 'TECH-SPK-001',
        supplierPrice: 95000,
        minimumOrderQty: 5,
        leadTimeDays: 5,
        isPreferred: true,
      },
    }),
    // 패션플러스 - 의류/패션 아이템들
    prisma.supplierProduct.create({
      data: {
        supplierId: suppliers[1].id,
        productId: products[1].id,
        supplierProductCode: 'FASH-TS-001',
        supplierPrice: 25000,
        minimumOrderQty: 20,
        leadTimeDays: 3,
        isPreferred: true,
      },
    }),
    prisma.supplierProduct.create({
      data: {
        supplierId: suppliers[1].id,
        productId: products[2].id,
        supplierProductCode: 'FASH-BP-001',
        supplierPrice: 55000,
        minimumOrderQty: 8,
        leadTimeDays: 5,
        isPreferred: true,
      },
    }),
    // 스포츠월드 - 운동화
    prisma.supplierProduct.create({
      data: {
        supplierId: suppliers[2].id,
        productId: products[4].id,
        supplierProductCode: 'SPORT-RUN-001',
        supplierPrice: 120000,
        minimumOrderQty: 12,
        leadTimeDays: 10,
        isPreferred: true,
      },
    }),
  ]);

  // 재고 이동 기록 생성 (최근 활동들)
  await Promise.all([
    prisma.stockMovement.create({
      data: {
        productId: products[0].id,
        movementType: 'IN',
        quantity: 50,
        unitCost: 280000,
        referenceType: 'PURCHASE',
        referenceId: BigInt(1001),
        notes: '신규 입고 - 발주번호 PO-2024-001',
        createdBy: adminUser.id,
      },
    }),
    prisma.stockMovement.create({
      data: {
        productId: products[1].id,
        movementType: 'OUT',
        quantity: 12,
        referenceType: 'ORDER',
        referenceId: BigInt(2001),
        notes: '온라인 주문 출고',
        createdBy: generalUser.id,
      },
    }),
    prisma.stockMovement.create({
      data: {
        productId: products[2].id,
        movementType: 'OUT',
        quantity: 15,
        referenceType: 'ORDER',
        referenceId: BigInt(2002),
        notes: '대량 주문 출고 - 품절 상태',
        createdBy: generalUser.id,
      },
    }),
    prisma.stockMovement.create({
      data: {
        productId: products[3].id,
        movementType: 'ADJUST',
        quantity: -3,
        referenceType: 'ADJUSTMENT',
        notes: '재고 조사 결과 분실 처리',
        createdBy: adminUser.id,
      },
    }),
  ]);
  console.log('📈 재고 이동 기록 생성 완료');

  console.log('✅ ERP 시드 데이터 생성 완료!');
  console.log('');
  console.log('🔐 로그인 정보:');
  console.log('   관리자: admin@beenest.com / admin123!');
  console.log('   사용자: user@beenest.com / user123!');
  console.log('');
  console.log('📊 생성된 데이터:');
  console.log(`   - 사용자: 2명`);
  console.log(`   - 카테고리: 5개 (계층 구조)`);
  console.log(`   - 공급업체: ${suppliers.length}개`);
  console.log(`   - 상품: ${products.length}개`);
  console.log(`   - 재고 정보: ${inventories.length}개`);
  console.log(`   - 재고 부족: 1개 (티셔츠)`);
  console.log(`   - 품절: 1개 (백팩)`);
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 중 오류:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });