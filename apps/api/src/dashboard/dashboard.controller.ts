import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from '@/dashboard/dashboard.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('대시보드')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: '대시보드 전체 통계 조회' })
  @ApiResponse({ status: 200, description: '통계 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async getDashboardStats(@Request() req) {
    const stats = await this.dashboardService.getDashboardStats(req.user.id);
    return {
      success: true,
      data: stats,
      message: '대시보드 통계 조회 성공',
    };
  }

  @Get('charts/inventory')
  @ApiOperation({ summary: '카테고리별 재고 현황 차트 데이터' })
  @ApiResponse({ status: 200, description: '차트 데이터 조회 성공' })
  async getInventoryChart(@Request() req) {
    const chartData = await this.dashboardService.getInventoryChart(req.user.id);
    return {
      success: true,
      data: chartData,
      message: '재고 차트 데이터 조회 성공',
    };
  }

  @Get('charts/stock-movement')
  @ApiOperation({ summary: '재고 이동 트렌드 차트 데이터' })
  @ApiQuery({ name: 'days', required: false, description: '조회 기간 (일수, 기본값: 7)' })
  @ApiResponse({ status: 200, description: '차트 데이터 조회 성공' })
  async getStockMovementChart(@Request() req, @Query('days') days = 7) {
    const chartData = await this.dashboardService.getStockMovementChart(
      req.user.id,
      Number(days),
    );
    return {
      success: true,
      data: chartData,
      message: '재고 이동 차트 데이터 조회 성공',
    };
  }

  @Get('alerts')
  @ApiOperation({ summary: '최근 알림 목록 조회' })
  @ApiQuery({ name: 'limit', required: false, description: '조회할 알림 수 (기본값: 10)' })
  @ApiResponse({ status: 200, description: '알림 목록 조회 성공' })
  async getRecentAlerts(@Request() req, @Query('limit') limit = 10) {
    const alerts = await this.dashboardService.getRecentAlerts(
      req.user.id,
      Number(limit),
    );
    return {
      success: true,
      data: alerts,
      message: '최근 알림 조회 성공',
    };
  }
}