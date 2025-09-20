import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';

// Test environment configuration
process.env.NODE_ENV = 'test';

// JWT secrets for tests
process.env.JWT_SECRET = 'test-secret-key-for-e2e-testing';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-e2e-testing';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';

// Use test schema
process.env.DATABASE_URL = 'postgresql://cinnamon:m4tch4@localhost:5432/beenest?schema=test';

// Other test environment variables
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.BCRYPT_ROUNDS = '4'; // Faster hashing for tests

// Global test setup for e2e tests
console.log('🧪 E2E Test Setup - Database:', process.env.DATABASE_URL);
console.log('🧪 Test Environment Variables set');

// Global Prisma client for test database cleanup
let globalPrisma: PrismaClient | undefined;

export async function getTestPrisma(): Promise<PrismaClient> {
  if (!globalPrisma) {
    globalPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  return globalPrisma;
}

export async function cleanupTestDatabase(): Promise<void> {
  const prisma = await getTestPrisma();

  try {
    // Delete in reverse order of dependencies to avoid foreign key violations
    await prisma.purchaseOrderItem.deleteMany();
    await prisma.purchaseOrder.deleteMany();
    await prisma.supplierProduct.deleteMany();
    await prisma.stockMovement.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Test database cleaned up');
  } catch (error) {
    console.error('❌ Error cleaning up test database:', error);
    throw error;
  }
}

export async function disconnectTestDatabase(): Promise<void> {
  if (globalPrisma) {
    await globalPrisma.$disconnect();
    globalPrisma = undefined;
    console.log('📦 Disconnected from test database');
  }
}

// Global teardown - cleanup database when tests complete
if (typeof global !== 'undefined') {
  (global as any).__TEST_CLEANUP__ = async () => {
    await cleanupTestDatabase();
    await disconnectTestDatabase();
  };
}