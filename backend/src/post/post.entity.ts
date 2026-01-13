import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { Like } from '../like/like.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @OneToMany(() => Like, (like) => like.post)
likes: Like[];

  // Çoka-Çok İlişki ve Ara Tablo (Join Table)
  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable() // Bu dekoratör SQLite'ta otomatik bir 'post_categories_category' tablosu oluşturur
  categories: Category[];
}