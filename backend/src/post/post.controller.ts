import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 1. TÜM YAZILARI GETİR (Ana sayfa için bu şart!)
  @Get('all')
  async getAllPosts() {
    return this.postService.findAll();
  }

  // 2. KATEGORİYE GÖRE FİLTRELE (Yeni eklediğimiz kısım)
  @Get('by-category/:id')
  async getByCategory(@Param('id') id: number) {
    return this.postService.findByCategory(id);
  }

  // 3. YAZI OLUŞTUR
  @Post('create')
  async createPost(@Body() postData: any) {
    return this.postService.create(postData);
  }

  // 4. YAZI GÜNCELLE
  @Post('update/:id')
  async updatePost(@Param('id') id: number, @Body() body: any) {
    return this.postService.update(id, body.userId, body.postData);
  }

  // 5. YAZI SİL
  @Post('delete/:id')
  async deletePost(@Param('id') id: number, @Body() body: any) {
    return this.postService.delete(id, body.userId, body.userRole);
  }
}