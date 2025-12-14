import { CrewAssignmentPosition } from 'src/common/enums/crewAssignmentPosition';
import { CrewAssignmentStatus } from 'src/common/enums/crewAssignmentStatus';
import { Flight } from 'src/flights/flight.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('crew_assignments')
export class CrewAssignment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    name: 'position',
    type: 'enum',
    enum: CrewAssignmentPosition,
  })
  position: CrewAssignmentPosition;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: CrewAssignmentStatus,
    default: CrewAssignmentStatus.ASSIGNED,
  })
  status: CrewAssignmentStatus;

  @ManyToOne(() => Flight, (flight) => flight.crewAssignments)
  @JoinColumn({ name: 'flight_id' })
  flight: Flight;

  @ManyToOne(() => User, (user) => user.crewAssignments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
