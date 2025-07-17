import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  register(registerDto: RegisterDto) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService // Must be injected
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.validateUser(
      loginDto.email,
      loginDto.password
    );
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload), // This generates the token
    };
  }
}