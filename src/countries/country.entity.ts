import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Airport } from 'src/airports/airport.entity';
import { Airline } from 'src/airlines/airline.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ name: 'iso_code', type: 'varchar', length: 2, unique: true })
  isoCode: string;

  @OneToMany(() => User, (user) => user.nationality)
  users: User[];

  @OneToMany(() => Airport, (airport) => airport.country)
  airports: Airport[];

  @OneToMany(() => Airline, (airline) => airline.country)
  airlines: Airline[];
}
