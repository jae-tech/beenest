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
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { OrdersService } from '@/orders/orders.service';
import { CreateOrderDto, UpdateOrderDto } from '@/orders/dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('주문 관리')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: '새 주문 생성' })
  @ApiResponse({ status: 201, description: '주문 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '공급업체 또는 상품을 찾을 수 없음' })
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const result = await this.ordersService.create(req.user.id, createOrderDto);
    return {
      success: true,
      data: result,
      message: '주문이 생성되었습니다',
    };
  }

  @Get()
  @ApiOperation({ summary: '주문 목록 조회' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호 (기본값: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지당 항목 수 (기본값: 20)' })
  @ApiQuery({ name: 'status', required: false, description: '주문 상태 필터 (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)' })
  @ApiResponse({ status: 200, description: '주문 목록 조회 성공' })
  async findAll(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
  ) {
    const result = await this.ordersService.findAll(
      req.user.id,
      Number(page),
      Number(limit),
      status,
    );
    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: '주문 목록 조회 성공',
    };
  }

  @Get('stats')
  @ApiOperation({ summary: '주문 통계 조회' })
  @ApiResponse({ status: 200, description: '주문 통계 조회 성공' })
  async getStats(@Request() req) {
    const stats = await this.ordersService.getOrderStats(req.user.id);
    return {
      success: true,
      data: stats,
      message: '주문 통계 조회 성공',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '주문 상세 정보 조회' })
  @ApiResponse({ status: 200, description: '주문 조회 성공' })
  @ApiResponse({ status: 404, description: '주문을 찾을 수 없음' })
  async findOne(@Param('id') id: string, @Request() req) {
    const order = await this.ordersService.findOne(id, req.user.id);
    return {
      success: true,
      data: order,
      message: '주문 조회 성공',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: '주문 정보 수정' })
  @ApiResponse({ status: 200, description: '주문 수정 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '주문을 찾을 수 없음' })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req,
  ) {
    const result = await this.ordersService.update(id, req.user.id, updateOrderDto);
    return {
      success: true,
      data: result,
      message: '주문이 수정되었습니다',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '주문 삭제' })
  @ApiResponse({ status: 200, description: '주문 삭제 성공' })
  @ApiResponse({ status: 400, description: '삭제할 수 없는 주문' })
  @ApiResponse({ status: 404, description: '주문을 찾을 수 없음' })
  async remove(@Param('id') id: string, @Request() req) {
    const result = await this.ordersService.remove(id, req.user.id);
    return {
      success: true,
      data: result,
      message: '주문이 삭제되었습니다',
    };
  }
}