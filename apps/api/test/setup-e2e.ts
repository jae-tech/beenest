import 'reflect-metadata';

// Mock Prisma for E2E tests
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Global test setup for e2e tests
// Add any global mocks or configurations here