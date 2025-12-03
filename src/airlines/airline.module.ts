import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airline } from './airline.entity';
import { Country } from 'src/countries/country.entity';
import { CountryModule } from 'src/countries/country.module';
import { CommonModule } from 'src/common/common.module';
import { AirlineController } from './airline.controller';
import { AirlineService } from './airline.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Airline, Country]),
    CountryModule,
    CommonModule,
  ],
  controllers: [AirlineController],
  providers: [AirlineService],
  exports: [AirlineService],
})
export class AirlineModule {}
