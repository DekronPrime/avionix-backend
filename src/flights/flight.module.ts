import { Module } from '@nestjs/common';
import { Flight } from './flight.entity';
import { Aircraft } from 'src/aircraft/aircraft.entity';
import { Airline } from 'src/airlines/airline.entity';
import { Airport } from 'src/airports/airport.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportModule } from 'src/airports/airport.module';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { CommonModule } from 'src/common/common.module';
import { AircraftModule } from 'src/aircraft/aircraft.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Flight, Aircraft, Airline, Airport]),
    AircraftModule,
    AirportModule,
    CommonModule,
  ],
  controllers: [FlightController],
  providers: [FlightService],
  exports: [FlightService],
})
export class FlightModule {}
