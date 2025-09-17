import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { ProductsModule } from '@/products/products.module';
import { SuppliersModule } from '@/suppliers/suppliers.module';
import { CategoriesModule } from '@/categories/categories.module';
import { InventoryModule } from '@/inventory/inventory.module';
import { DashboardModule } from '@/dashboard/dashboard.module';
import { OrdersModule } from '@/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    SuppliersModule,
    CategoriesModule,
    InventoryModule,
    DashboardModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
