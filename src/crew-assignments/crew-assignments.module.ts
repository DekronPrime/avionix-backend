import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { Flight } from 'src/flights/flight.entity';
import { FlightModule } from 'src/flights/flight.module';
import { User } from 'src/users/user.entity';
import { UserModule } from 'src/users/user.module';
import { CrewAssignmentController } from './crew-assignments.controller';
import { CrewAssignmentService } from './crew-assignments.service';
import { CrewAssignment } from './crew-assignments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CrewAssignment, Flight, User]),
    FlightModule,
    UserModule,
    CommonModule,
  ],
  controllers: [CrewAssignmentController],
  providers: [CrewAssignmentService],
  exports: [CrewAssignmentService],
})
export class CrewAssignmentModule {}
