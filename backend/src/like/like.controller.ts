import { Controller, Post, Body } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('toggle')
  async toggle(@Body() body: { postId: number; userId: number }) {
    return this.likeService.toggleLike(body.postId, body.userId);
  }
}