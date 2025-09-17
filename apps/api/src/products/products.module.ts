import { Module } from '@nestjs/common';
import { ProductsService } from '@/products/products.service';
import { ProductsController } from '@/products/products.controller';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}