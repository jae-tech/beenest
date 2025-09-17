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
import { SuppliersService } from '@/suppliers/suppliers.service';
import { CreateSupplierDto, UpdateSupplierDto } from '@/suppliers/dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('공급업체 관리')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @ApiOperation({ summary: '공급업체 생성' })
  @ApiResponse({ status: 201, description: '공급업체 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async create(@Body() createSupplierDto: CreateSupplierDto, @Request() req) {
    return this.suppliersService.create(req.user.id, createSupplierDto);
  }

  @Get()
  @ApiOperation({ summary: '공급업체 목록 조회' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호 (기본값: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지당 항목 수 (기본값: 10)' })
  @ApiQuery({ name: 'search', required: false, description: '검색어 (회사명, 코드, 담당자, 이메일)' })
  @ApiQuery({ name: 'status', required: false, description: '상태 필터 (active, inactive, pending)' })
  @ApiResponse({ status: 200, description: '공급업체 목록 조회 성공' })
  async findAll(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.suppliersService.findAll(
      req.user.id,
      Number(page),
      Number(limit),
      search,
      status,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: '공급업체 통계 조회' })
  @ApiResponse({ status: 200, description: '공급업체 통계 조회 성공' })
  async getStats(@Request() req) {
    return this.suppliersService.getSupplierStats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '공급업체 상세 조회' })
  @ApiResponse({ status: 200, description: '공급업체 상세 조회 성공' })
  @ApiResponse({ status: 404, description: '공급업체를 찾을 수 없음' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.suppliersService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '공급업체 정보 수정' })
  @ApiResponse({ status: 200, description: '공급업체 정보 수정 성공' })
  @ApiResponse({ status: 404, description: '공급업체를 찾을 수 없음' })
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Request() req,
  ) {
    return this.suppliersService.update(id, req.user.id, updateSupplierDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '공급업체 삭제' })
  @ApiResponse({ status: 200, description: '공급업체 삭제 성공' })
  @ApiResponse({ status: 404, description: '공급업체를 찾을 수 없음' })
  @ApiResponse({ status: 400, description: '연결된 상품이 있어 삭제할 수 없음' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.suppliersService.remove(id, req.user.id);
  }

  @Post(':supplierId/products/:productId')
  @ApiOperation({ summary: '공급업체에 상품 연결' })
  @ApiResponse({ status: 201, description: '상품 연결 성공' })
  @ApiResponse({ status: 404, description: '공급업체 또는 상품을 찾을 수 없음' })
  @ApiResponse({ status: 400, description: '이미 연결된 관계' })
  async addProductToSupplier(
    @Param('supplierId') supplierId: string,
    @Param('productId') productId: string,
    @Body() supplierProductData: {
      supplierProductCode?: string;
      supplierPrice?: number;
      minimumOrderQty?: number;
      leadTimeDays?: number;
      isPreferred?: boolean;
    },
    @Request() req,
  ) {
    return this.suppliersService.addProductToSupplier(
      supplierId,
      productId,
      req.user.id,
      supplierProductData,
    );
  }
}