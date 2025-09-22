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
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionQueryDto,
} from './dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TransactionStatus } from '@prisma/client';

@ApiTags('거래 관리')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: '거래 생성' })
  @ApiResponse({ status: 201, description: '거래 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    return this.transactionsService.create(req.user.id, createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: '거래 목록 조회' })
  @ApiResponse({ status: 200, description: '거래 목록 조회 성공' })
  async findAll(@Query() query: TransactionQueryDto, @Request() req) {
    return this.transactionsService.findAll(req.user.id, query);
  }

  @Get('stats')
  @ApiOperation({ summary: '거래 통계 조회' })
  @ApiResponse({ status: 200, description: '거래 통계 조회 성공' })
  async getStats(@Request() req) {
    return this.transactionsService.getStats(req.user.id);
  }

  @Get('stats/monthly')
  @ApiOperation({ summary: '월별 거래 통계' })
  @ApiResponse({ status: 200, description: '월별 거래 통계 조회 성공' })
  async getMonthlyStats(@Request() req) {
    return this.transactionsService.getMonthlyStats(req.user.id);
  }

  @Get('stats/partners')
  @ApiOperation({ summary: '거래처별 통계' })
  @ApiResponse({ status: 200, description: '거래처별 통계 조회 성공' })
  async getPartnerStats(@Request() req) {
    return this.transactionsService.getPartnerStats(req.user.id);
  }

  @Get('stats/products')
  @ApiOperation({ summary: '상품별 거래 통계' })
  @ApiResponse({ status: 200, description: '상품별 거래 통계 조회 성공' })
  async getProductStats(@Request() req) {
    return this.transactionsService.getProductStats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '거래 상세 조회' })
  @ApiParam({ name: 'id', description: '거래 ID' })
  @ApiResponse({ status: 200, description: '거래 조회 성공' })
  @ApiResponse({ status: 404, description: '거래를 찾을 수 없음' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.transactionsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '거래 수정' })
  @ApiParam({ name: 'id', description: '거래 ID' })
  @ApiResponse({ status: 200, description: '거래 수정 성공' })
  @ApiResponse({ status: 404, description: '거래를 찾을 수 없음' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req,
  ) {
    return this.transactionsService.update(req.user.id, id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '거래 삭제' })
  @ApiParam({ name: 'id', description: '거래 ID' })
  @ApiResponse({ status: 200, description: '거래 삭제 성공' })
  @ApiResponse({ status: 404, description: '거래를 찾을 수 없음' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.transactionsService.remove(req.user.id, id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '거래 상태 변경' })
  @ApiParam({ name: 'id', description: '거래 ID' })
  @ApiResponse({ status: 200, description: '거래 상태 변경 성공' })
  @ApiResponse({ status: 404, description: '거래를 찾을 수 없음' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: TransactionStatus,
    @Request() req,
  ) {
    return this.transactionsService.updateStatus(req.user.id, id, status);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: '거래 복제' })
  @ApiParam({ name: 'id', description: '거래 ID' })
  @ApiResponse({ status: 201, description: '거래 복제 성공' })
  @ApiResponse({ status: 404, description: '거래를 찾을 수 없음' })
  async duplicate(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.transactionsService.duplicate(req.user.id, id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: '거래 승인' })
  @ApiParam({ name: 'id', description: '거래 ID' })
  @ApiResponse({ status: 200, description: '거래 승인 성공' })
  @ApiResponse({ status: 404, description: '거래를 찾을 수 없음' })
  async approve(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.transactionsService.approve(req.user.id, id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: '거래 반려' })
  @ApiParam({ name: 'id', description: '거래 ID' })
  @ApiResponse({ status: 200, description: '거래 반려 성공' })
  @ApiResponse({ status: 404, description: '거래를 찾을 수 없음' })
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() body: { reason?: string },
  ) {
    return this.transactionsService.reject(req.user.id, id, body.reason);
  }
}