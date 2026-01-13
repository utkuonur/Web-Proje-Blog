import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { LikeModule } from './like/like.module';

@Module({
  imports: [
    // Veritabanı Ayarları (SQLite)
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      // Tüm .entity dosyalarını otomatik olarak tarar
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // Kodda değişiklik yaptıkça tablo yapısını otomatik günceller
      synchronize: true, 
    }),
    // Proje Gereksinimlerini Karşılayan 4 Ana Modül
    UserModule,     // Kullanıcı ve Rol sistemi 
    PostModule,     // Yazı yönetimi 
    CategoryModule, // Many-to-Many ilişki için [cite: 9]
    LikeModule,  // One-to-Many ilişki için [cite: 8]
  ],
})
export class AppModule {}