import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Post } from '../post/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column() 
  firstName: string;

  @Column() 
  lastName: string;

  @Column({ unique: true }) 
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;
  
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}