import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { OrdersService } from '@/orders/orders.service';
import { OrdersController } from '@/orders/orders.controller';

@Module({
  imports: [PrismaModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}