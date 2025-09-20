import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { InventoryService } from '@/inventory/inventory.service';
import { UpdateInventoryDto, GetMovementsDto, MovementsResponseDto } from '@/inventory/dto';
import { AdjustStockDto } from '@/products/dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('재고 관리')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('products/:productId/adjust')
  @ApiOperation({ summary: '재고 조정' })
  @ApiResponse({ status: 200, description: '재고 조정 성공' })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음' })
  @ApiResponse({ status: 400, description: '재고 부족 또는 잘못된 요청' })
  async adjustStock(
    @Param('productId') productId: string,
    @Body() adjustStockDto: AdjustStockDto,
    @Request() req,
  ) {
    return this.inventoryService.adjustStock(productId, req.user.id, adjustStockDto);
  }

  @Patch('products/:productId/settings')
  @ApiOperation({ summary: '재고 설정 업데이트' })
  @ApiResponse({ status: 200, description: '재고 설정 업데이트 성공' })
  async updateInventorySettings(
    @Param('productId') productId: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
    @Request() req,
  ) {
    return this.inventoryService.updateInventorySettings(
      productId,
      req.user.id,
      updateInventoryDto,
    );
  }

  @Get('products/:productId')
  @ApiOperation({ summary: '상품별 재고 현황 조회' })
  @ApiResponse({ status: 200, description: '재고 현황 조회 성공' })
  async getInventoryByProduct(@Param('productId') productId: string, @Request() req) {
    return this.inventoryService.getInventoryByProduct(productId, req.user.id);
  }

  @Get('alerts/low-stock')
  @ApiOperation({ summary: '재고 부족 알림 조회' })
  @ApiResponse({ status: 200, description: '재고 부족 알림 조회 성공' })
  async getLowStockAlert(@Request() req) {
    return this.inventoryService.getLowStockAlert(req.user.id);
  }

  @Get('products/:productId/movements')
  @ApiOperation({ summary: '상품별 재고 이동 이력 조회' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호 (기본값: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지당 항목 수 (기본값: 20)' })
  @ApiResponse({ status: 200, description: '재고 이동 이력 조회 성공' })
  async getStockMovements(
    @Param('productId') productId: string,
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.inventoryService.getStockMovements(
      productId,
      req.user.id,
      Number(page),
      Number(limit),
    );
  }

  @Get('movements')
  @ApiOperation({ summary: '전체 재고 이동 이력 조회' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호 (기본값: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지당 항목 수 (기본값: 20)' })
  @ApiQuery({ name: 'productId', required: false, description: '특정 상품 필터링' })
  @ApiResponse({
    status: 200,
    description: '전체 재고 이동 이력 조회 성공',
    type: MovementsResponseDto
  })
  async getAllMovements(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('productId') productId?: string,
  ): Promise<MovementsResponseDto> {
    return this.inventoryService.getAllMovements(
      req.user.id,
      Number(page),
      Number(limit),
      productId,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: '재고 통계 조회' })
  @ApiResponse({ status: 200, description: '재고 통계 조회 성공' })
  async getInventoryStats(@Request() req) {
    return this.inventoryService.getInventoryStats(req.user.id);
  }
}