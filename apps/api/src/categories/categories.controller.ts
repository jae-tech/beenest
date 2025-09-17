import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CategoriesService } from '@/categories/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '@/categories/dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('상품 카테고리')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: '카테고리 생성' })
  @ApiResponse({ status: 201, description: '카테고리 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '부모 카테고리를 찾을 수 없음' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: '카테고리 목록 조회 (평면 리스트)' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    description: '비활성 카테고리 포함 여부 (기본값: false)'
  })
  @ApiResponse({ status: 200, description: '카테고리 목록 조회 성공' })
  async findAll(@Query('includeInactive') includeInactive: string = 'false') {
    return this.categoriesService.findAll(includeInactive === 'true');
  }

  @Get('tree')
  @ApiOperation({ summary: '카테고리 트리 구조 조회' })
  @ApiResponse({ status: 200, description: '카테고리 트리 조회 성공' })
  async findTree() {
    return this.categoriesService.findTree();
  }

  @Get('stats')
  @ApiOperation({ summary: '카테고리 통계 조회' })
  @ApiResponse({ status: 200, description: '카테고리 통계 조회 성공' })
  async getStats() {
    return this.categoriesService.getCategoryStats();
  }

  @Get(':id')
  @ApiOperation({ summary: '카테고리 상세 조회' })
  @ApiResponse({ status: 200, description: '카테고리 상세 조회 성공' })
  @ApiResponse({ status: 404, description: '카테고리를 찾을 수 없음' })
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '카테고리 정보 수정' })
  @ApiResponse({ status: 200, description: '카테고리 정보 수정 성공' })
  @ApiResponse({ status: 404, description: '카테고리를 찾을 수 없음' })
  @ApiResponse({ status: 400, description: '순환 참조 발생' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '카테고리 삭제' })
  @ApiResponse({ status: 200, description: '카테고리 삭제 성공' })
  @ApiResponse({ status: 404, description: '카테고리를 찾을 수 없음' })
  @ApiResponse({ status: 400, description: '하위 카테고리 또는 연결된 상품이 있어 삭제할 수 없음' })
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}