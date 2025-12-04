import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aircraft } from './aircraft.entity';
import { Airline } from 'src/airlines/airline.entity';
import { AirlineModule } from 'src/airlines/airline.module';
import { CommonModule } from 'src/common/common.module';
import { AircraftController } from './aircraft.controller';
import { AircraftService } from './aircraft.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Aircraft, Airline]),
    AirlineModule,
    CommonModule,
  ],
  controllers: [AircraftController],
  providers: [AircraftService],
  exports: [AircraftService],
})
export class AircraftModule {}
