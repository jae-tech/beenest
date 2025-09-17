import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { ProductsService } from '@/products/products.service';
import { CreateProductDto, UpdateProductDto, AdjustStockDto } from '@/products/dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('상품 관리')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: '상품 생성' })
  @ApiResponse({ status: 201, description: '상품 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    return this.productsService.create(req.user.id, createProductDto);
  }

  @Get()
  @ApiOperation({ summary: '상품 목록 조회' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호 (기본값: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지당 항목 수 (기본값: 10)' })
  @ApiQuery({ name: 'search', required: false, description: '검색어 (상품명, SKU, 설명)' })
  @ApiResponse({ status: 200, description: '상품 목록 조회 성공' })
  async findAll(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(
      req.user.id,
      Number(page),
      Number(limit),
      search,
    );
  }

  @Get('low-stock')
  @ApiOperation({ summary: '재고 부족 상품 목록 조회' })
  @ApiResponse({ status: 200, description: '재고 부족 상품 목록 조회 성공' })
  async getLowStockProducts(@Request() req) {
    return this.productsService.getLowStockProducts(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '상품 상세 조회' })
  @ApiResponse({ status: 200, description: '상품 상세 조회 성공' })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.productsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '상품 정보 수정' })
  @ApiResponse({ status: 200, description: '상품 정보 수정 성공' })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    return this.productsService.update(id, req.user.id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '상품 삭제' })
  @ApiResponse({ status: 200, description: '상품 삭제 성공' })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.productsService.remove(id, req.user.id);
  }

  @Post(':id/stock')
  @ApiOperation({ summary: '재고 수량 조정' })
  @ApiResponse({ status: 200, description: '재고 조정 성공' })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음' })
  @ApiResponse({ status: 400, description: '잘못된 재고 조정 요청' })
  async adjustStock(
    @Param('id') id: string,
    @Body() adjustStockDto: AdjustStockDto,
    @Request() req,
  ) {
    return this.productsService.adjustStock(
      id,
      req.user.id,
      adjustStockDto.quantity,
      adjustStockDto.reason,
    );
  }
}