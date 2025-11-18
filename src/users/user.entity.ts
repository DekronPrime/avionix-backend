import { UserRole } from 'src/common/enums/userRole';
import { UserStatus } from 'src/common/enums/userStatus';
import { Country } from 'src/countries/country.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'username', type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 50 })
  lastName: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate?: Date;

  @Column({
    name: 'passport_number',
    type: 'varchar',
    length: 20,
    nullable: true,
    unique: true,
  })
  passportNumber?: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.PASSENGER,
  })
  role: UserRole;

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'password', type: 'text', select: false })
  password: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 20,
    nullable: true,
    unique: true,
  })
  phone?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.INCOMPLETE_PROFILE,
  })
  status: UserStatus;

  @ManyToOne(() => Country, (country) => country.users, { nullable: true })
  @JoinColumn({ name: 'nationality_id' })
  nationality: Country;
}
