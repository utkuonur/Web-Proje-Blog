import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: any): Promise<any> {
  const existing = await this.userRepository.findOne({ where: { email: userData.email } });
  if (existing) throw new Error('Bu e-posta zaten kayıtlı!');

  const newUser = this.userRepository.create(userData);
  return await this.userRepository.save(newUser);
}

  async login(email: string, password: string): Promise<User | null> {
  const user = await this.userRepository.findOne({ where: { email } });
  if (user && user.password === password) { 
    return user;
  }
  return null;
}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
  
  async updateRole(adminId: number, targetUserId: number, newRole: string) {
  const requester = await this.userRepository.findOne({ where: { id: adminId } });

  if (!requester || requester.role !== 'admin') {
    throw new UnauthorizedException('Bu işlemi yapmaya yetkiniz yok! Sadece adminler rol değiştirebilir.');
  }
  const targetUser = await this.userRepository.findOne({ where: { id: targetUserId } });
  if (!targetUser) {
    throw new NotFoundException('Rolü değiştirilmek istenen kullanıcı bulunamadı!');
  }
  targetUser.role = newRole;
  return await this.userRepository.save(targetUser);
}

}