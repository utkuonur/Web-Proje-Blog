import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service'; // Manuel eklediysen burayı kontrol et
import { UserController } from './user.controller'; // Manuel eklediysen burayı kontrol et

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService], // Servisi buraya eklemelisin
  controllers: [UserController], // Controller'ı buraya eklemelisin
})
export class UserModule {}