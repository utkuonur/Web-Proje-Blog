import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Post } from '../post/post.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Çoka-Çok İlişki (Many-to-Many)
  @ManyToMany(() => Post, (post) => post.categories)
  posts: Post[];
}