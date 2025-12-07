import { AirportStatus } from 'src/common/enums/ariportStatus';
import { Country } from 'src/countries/country.entity';
import { Flight } from 'src/flights/flight.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('airports')
export class Airport {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ name: 'city', type: 'varchar', length: 100 })
  city: string;

  @Column({ name: 'iata_code', type: 'char', length: 3, unique: true })
  iataCode: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: AirportStatus,
    default: AirportStatus.ACTIVE,
  })
  status: AirportStatus;

  @ManyToOne(() => Country, (country) => country.airports)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany(() => Flight, (flight) => flight.departureAirport)
  departureFlights: Flight[];

  @OneToMany(() => Flight, (flight) => flight.arrivalAirport)
  arrivalFlights: Flight[];
}
