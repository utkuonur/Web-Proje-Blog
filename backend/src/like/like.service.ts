import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async toggleLike(postId: number, userId: number) {
    const existingLike = await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      return { status: 'unliked' };
    } else {
      const newLike = this.likeRepository.create({
        post: { id: postId },
        user: { id: userId },
      });
      await this.likeRepository.save(newLike);
      return { status: 'liked' };
    }
  }
}