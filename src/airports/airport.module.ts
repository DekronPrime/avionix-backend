import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airport } from './airport.entity';
import { Country } from 'src/countries/country.entity';
import { CommonModule } from 'src/common/common.module';
import { AirportController } from './airport.controller';
import { AirportService } from './airport.service';
import { CountryModule } from 'src/countries/country.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Airport, Country]),
    CountryModule,
    CommonModule,
  ],
  controllers: [AirportController],
  providers: [AirportService],
  exports: [AirportService],
})
export class AirportModule {}
