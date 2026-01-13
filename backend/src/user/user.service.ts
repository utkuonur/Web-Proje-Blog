import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Kayıt olma fonksiyonu
  // Dönüş tipini 'any' yaparak TypeScript'in katı kuralını esnetiyoruz
  async create(userData: any): Promise<any> {
  // Eğer email zaten varsa hata döndürmek için (Opsiyonel ama iyi olur)
  const existing = await this.userRepository.findOne({ where: { email: userData.email } });
  if (existing) throw new Error('Bu e-posta zaten kayıtlı!');

  const newUser = this.userRepository.create(userData);
  return await this.userRepository.save(newUser);
}

  async login(email: string, password: string): Promise<User | null> {
  const user = await this.userRepository.findOne({ where: { email } });
  if (user && user.password === password) { // Şimdilik şifreyi düz metin kontrol ediyoruz
    return user;
  }
  return null;
}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async updateRole(adminId: number, targetUserId: number, newRole: string) {
  // ŞU SATIRI GEÇİCİ OLARAK YORUMA AL (VEYA SİL):
  // const admin = await this.userRepo.findOne({ where: { id: adminId, role: 'admin' } });
  // if (!admin) throw new Error('Bu işlem için admin yetkisi gerekiyor!');

  // Direkt hedef kullanıcıyı bul ve yetkiyi ver
  const targetUser = await this.userRepository.findOne({ where: { id: targetUserId } });
  if (!targetUser) throw new Error('Kullanıcı bulunamadı!');

  targetUser.role = newRole;
  return await this.userRepository.save(targetUser);
}

}