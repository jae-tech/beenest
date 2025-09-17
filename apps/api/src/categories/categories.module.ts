import { Module } from '@nestjs/common';
import { CategoriesService } from '@/categories/categories.service';
import { CategoriesController } from '@/categories/categories.controller';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}