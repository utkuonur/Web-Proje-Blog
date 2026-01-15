import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('all')
  async getAllPosts() {
    return this.postService.findAll();
  }

  @Get('by-category/:id')
  async getByCategory(@Param('id') id: number) {
    return this.postService.findByCategory(id);
  }

  @Post('create')
  async createPost(@Body() postData: any) {
    return this.postService.create(postData);
  }

  @Post('update/:id')
  async updatePost(@Param('id') id: number, @Body() body: any) {
    return this.postService.update(id, body.userId, body.postData);
  }

  @Post('delete/:id')
  async deletePost(@Param('id') id: number, @Body() body: any) {
    return this.postService.delete(id, body.userId, body.userRole);
  }
}