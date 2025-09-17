import { Module } from '@nestjs/common';
import { SuppliersService } from '@/suppliers/suppliers.service';
import { SuppliersController } from '@/suppliers/suppliers.controller';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService],
})
export class SuppliersModule {}