import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/common/enums/userRole';
import { UserStatus } from 'src/common/enums/userStatus';
import { MapperService } from 'src/common/mappers/mapper.service';
import { CountryService } from 'src/countries/country.service';
import { Repository } from 'typeorm';
import { UserResponseDto } from '../common/dto/userResponse.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly countryService: CountryService,
    private readonly mapper: MapperService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hash,
      role: UserRole.PASSENGER,
      status: UserStatus.INCOMPLETE_PROFILE,
    });

    const savedUser = await this.userRepository.save(user);
    return this.mapper.toDto(UserResponseDto, savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['nationality'],
      withDeleted: true,
    });

    return this.mapper.toDtos(UserResponseDto, users);
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['nationality'],
      withDeleted: true,
    });

    if (!user) throw new NotFoundException(`User with id=${id} not found`);
    return this.mapper.toDto(UserResponseDto, user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByUsernameOrEmail(username: string, email: string) {
    return this.userRepository.findOne({
      where: [{ email }, { username }],
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { id },
      relations: ['nationality'],
      withDeleted: true,
    });

    if (!existingUser)
      throw new NotFoundException(`User with id=${id} not found`);
    if (updateUserDto.nationalityId) {
      existingUser.nationality = await this.countryService.findById(
        updateUserDto.nationalityId,
      );
    }

    const sanitizedDto = Object.fromEntries(
      Object.entries(updateUserDto).filter(([_, v]) => v !== undefined),
    );
    Object.assign(existingUser, sanitizedDto);

    const isComplete = this.isUserProfileComplete(existingUser);
    if (isComplete && existingUser.status !== UserStatus.ACTIVE) {
      existingUser.status = UserStatus.ACTIVE;
    }

    const updatedUser = await this.userRepository.save(existingUser);
    return this.mapper.toDto(UserResponseDto, updatedUser);
  }

  async delete(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (user.status === UserStatus.DELETED) {
      throw new BadRequestException(`User with ID ${id} is already deleted`);
    }

    user.status = UserStatus.DELETED;
    user.deletedAt = new Date();

    const savedUser = await this.userRepository.save(user);
    return this.mapper.toDto(UserResponseDto, savedUser);
  }

  async findUserForAuth(login: string) {
    return this.userRepository.findOne({
      where: [{ username: login }, { email: login }],
      select: ['id', 'username', 'email', 'password', 'role', 'status'],
    });
  }

  async isFieldTaken(field: keyof User, value: string): Promise<boolean> {
    const existing = await this.userRepository.findOne({
      where: { [field]: value },
      withDeleted: true,
    });
    return !!existing;
  }

  private isUserProfileComplete(user: User): boolean {
    const requiredFields = [
      'username',
      'firstName',
      'lastName',
      'birthDate',
      'passportNumber',
      'email',
      'phone',
      'nationality',
    ];

    return requiredFields.every((f) => !!(user as any)[f]);
  }
}
