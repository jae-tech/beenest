import { Module } from '@nestjs/common';
import { InventoryService } from '@/inventory/inventory.service';
import { InventoryController } from '@/inventory/inventory.controller';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}