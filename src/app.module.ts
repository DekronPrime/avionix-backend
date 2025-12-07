import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './config/orm.config';
import { UserModule } from './users/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGlobalGuard } from './common/guards/jwtGlobal.guard';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { CommonModule } from './common/common.module';
import { AirportModule } from './airports/airport.module';
import { CountryModule } from './countries/country.module';
import { AirlineModule } from './airlines/airline.module';
import { AircraftModule } from './aircraft/aircraft.module';
import { FlightModule } from './flights/flight.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    UserModule,
    AuthModule,
    CommonModule,
    AirportModule,
    AirlineModule,
    AircraftModule,
    CountryModule,
    FlightModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGlobalGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
