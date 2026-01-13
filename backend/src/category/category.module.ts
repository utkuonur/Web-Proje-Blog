import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  // TypeORM'a bu modülün 'Category' tablosunu (entity) kullanacağını tanıtıyoruz 
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [TypeOrmModule] // Post modülü kategorileri görebilsin diye export ediyoruz
})
export class CategoryModule {}