import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Category } from '../category/category.entity'; // Kategori entity'sini ekle
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  // Buraya Category'yi de ekliyoruz ki ilişkiyi yönetebilelim 
  imports: [TypeOrmModule.forFeature([Post, Category])], 
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}