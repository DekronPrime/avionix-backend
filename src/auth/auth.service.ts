import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/authResponse.dto';
import { UserResponseDto } from 'src/common/dto/userResponse.dto';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const userExists = await this.userService.findByUsernameOrEmail(
      registerDto.username,
      registerDto.email,
    );
    if (userExists) throw new BadRequestException('User already exists');

    const hash = await bcrypt.hash(registerDto.password, 10);

    const createdUser = await this.userService.create({
      ...registerDto,
      password: hash,
    });

    return this.generateAuthResponse(createdUser);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.login, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }

  async validateUser(login: string, pass: string) {
    const user = await this.userService.findUserForAuth(login);

    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) return null;

    return user;
  }

  private async generateAuthResponse(
    user: User | UserResponseDto,
  ): Promise<AuthResponseDto> {
    const payload = {
      sub: Number(user.id),
      id: Number(user.id),
      username: user.username,
      role: user.role,
      status: user.status,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      user: plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
      token,
    };
  }
}
