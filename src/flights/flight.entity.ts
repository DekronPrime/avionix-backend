import { Aircraft } from 'src/aircraft/aircraft.entity';
import { Airline } from 'src/airlines/airline.entity';
import { Airport } from 'src/airports/airport.entity';
import { FlightStatus } from 'src/common/enums/flightStatus';
import { CrewAssignment } from 'src/crew-assignments/crew-assignments.entity';
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

@Entity('flights')
export class Flight {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'flight_code', type: 'varchar', length: 10, unique: true })
  flightCode: string;

  @Column({ name: 'flight_number', type: 'int' })
  flightNumber: number;

  @Column({ name: 'departure_time', type: 'timestamp' })
  departureTime: Date;

  @Column({ name: 'arrival_time', type: 'timestamp' })
  arrivalTime: Date;

  @Column({ name: 'duration', type: 'int' })
  duration: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: FlightStatus,
    default: FlightStatus.SCHEDULED,
  })
  status: FlightStatus;

  @ManyToOne(() => Aircraft, (aircraft) => aircraft.flights)
  @JoinColumn({ name: 'aircraft_id' })
  aircraft: Aircraft;

  @ManyToOne(() => Airline, (airline) => airline.flights)
  @JoinColumn({ name: 'airline_id' })
  airline: Airline;

  @ManyToOne(() => Airport, (airport) => airport.departureFlights)
  @JoinColumn({ name: 'departure_airport_id' })
  departureAirport: Airport;

  @ManyToOne(() => Airport, (airport) => airport.arrivalFlights)
  @JoinColumn({ name: 'arrival_airport_id' })
  arrivalAirport: Airport;

  @OneToMany(() => CrewAssignment, (crewAssignment) => crewAssignment.flight)
  crewAssignments: CrewAssignment[];
}
