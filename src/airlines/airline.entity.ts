import { Aircraft } from 'src/aircraft/aircraft.entity';
import { AirlineStatus } from 'src/common/enums/airlinesStatus';
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

@Entity('airlines')
export class Airline {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ name: 'iata_code', type: 'char', length: 2, unique: true })
  iataCode: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: AirlineStatus,
    default: AirlineStatus.ACTIVE,
  })
  status: AirlineStatus;

  @ManyToOne(() => Country, (country) => country.airlines)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany(() => Aircraft, (aircraft) => aircraft.airline)
  aircraft: Aircraft[];

  @OneToMany(() => Flight, (flight) => flight.airline)
  flights: Flight[];
}
