import { Controller, Post, Body, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async createCategory(@Body() categoryData: { name: string }) {
    // Tüm body'yi alıp içinden name'i çekiyoruz, daha güvenli
    return this.categoryService.create(categoryData.name);
  }

  @Get('all')
  async getAll() {
    return this.categoryService.findAll();
  }
}