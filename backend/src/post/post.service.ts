import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(postData: any): Promise<Post> {
  const categories = (postData.categories || []).map(catId => ({
    id: Number(catId)
  }));

  const newPost = this.postRepository.create({
    title: postData.title,
    content: postData.content,
    author: { id: Number(postData.author) }, 
    categories: categories 
  });

  try {
    return await this.postRepository.save(newPost);
  } catch (error) {
    console.error("Veritabanı Kayıt Hatası:", error);
    throw new Error("Yazı kaydedilirken veritabanı hatası oluştu.");
  }
}

  async update(id: number, userId: number, postData: any): Promise<Post> {
  const post = await this.postRepository.findOne({ 
    where: { id }, 
    relations: ['author'] 
  });

  if (!post) throw new Error('Yazı bulunamadı');

  if (post.author.id !== userId) {
    throw new Error('Bu yazıyı güncelleme yetkiniz yok!');
  }

  const { categories, ...rest } = postData;
  Object.assign(post, rest);

  if (categories) {
    post.categories = categories.map(catId => ({ id: catId } as any));
  }

  return await this.postRepository.save(post);
}
  async delete(id: number, userId: number, userRole: string): Promise<any> {
    const post = await this.postRepository.findOne({ where: { id }, relations: ['author'] });
    
    if (!post) throw new Error("Yazı bulunamadı");

    if (post.author.id === userId || userRole === 'admin') {
      return await this.postRepository.delete(id);
    }
    
    throw new Error("Bu yazıyı silme yetkiniz yok");
  }

  async findAll(): Promise<Post[]> {
  return await this.postRepository.find({
    relations: ['author', 'categories', 'likes'], 
    order: { id: 'DESC' }
  });
}

async findByCategory(categoryId: number): Promise<Post[]> {
  return await this.postRepository.find({
    where: { categories: { id: categoryId } },
    relations: ['author', 'categories', 'likes'],
    order: { id: 'DESC' }
  });
}
}