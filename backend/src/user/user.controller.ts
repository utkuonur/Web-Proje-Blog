import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user') // Burası 'user' ise istek 'http://localhost:3000/user/register' olur
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register') // Frontend bu isme bakıyor
  async register(@Body() userData: any) {
    return this.userService.create(userData);
  }

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.userService.login(body.email, body.password);
    if (!user) throw new Error('Hatalı giriş');
    return user;
  }

  @Get('all') // Tüm kullanıcıları görme adresi: /user/all
  async getAllUsers() {
    return this.userService.findAll();
  }
  
  @Post('update-role')
async updateRole(@Body() body: { adminId: number; targetUserId: number; newRole: string }) {
  return this.userService.updateRole(body.adminId, body.targetUserId, body.newRole);
  }

}