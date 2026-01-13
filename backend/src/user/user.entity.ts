import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from '../post/post.entity';

// @Entity() hocaya bunun bir veritabanı tablosu olduğunu söyler
@Entity()
export class User {
  @PrimaryGeneratedColumn() // Otomatik artan ID (1, 2, 3...)
  id: number;

  @Column() // Ad sütunu
  firstName: string;

  @Column() // Soyad sütunu
  lastName: string;

  @Column({ unique: true }) // Email benzersiz olmalı (Hoca sorarsa: "Aynı maille iki kişi üye olamaz")
  email: string;

  @Column() // Şifre sütunu
  password: string;

  @Column({ default: 'user' }) // Varsayılan rol 'user'. Hoca istediği için 'admin' de yapabileceğiz 
  role: string;
  
  @OneToMany(() => Post, (post) => post.author)
posts: Post[];
}