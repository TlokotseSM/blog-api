import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: any) {
    // Implement registration logic
  }

  async login(loginDto: any) {
    // Implement login logic
  }
}