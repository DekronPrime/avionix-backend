import { Airline } from 'src/airlines/airline.entity';
import { AircraftStatus } from 'src/common/enums/aircraftStatus';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('aircraft')
@Check(`"capacity" > 0`)
export class Aircraft {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'model', type: 'varchar', length: 100 })
  model: string;

  @Column({ name: 'capacity', type: 'int' })
  capacity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: AircraftStatus,
    default: AircraftStatus.AVAILABLE,
  })
  status: AircraftStatus;

  @ManyToOne(() => Airline, (airline) => airline.aircraft)
  @JoinColumn({ name: 'airline_id' })
  airline: Airline;
}
