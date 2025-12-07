import { Expose, Type } from 'class-transformer';
import { AircraftResponseDto } from 'src/aircraft/dto/aircraftResponse.dto';
import { AirlineResponseDto } from 'src/airlines/dto/airlineResponse.dto';
import { AirportResponseDto } from 'src/airports/dto/airportResponse.dto';
import { FlightStatus } from 'src/common/enums/flightStatus';

export class FlightResponseDto {
  @Expose() id: number;
  @Expose() flightCode: string;
  @Expose() flightNumber: number;
  @Expose() departureTime: Date;
  @Expose() arrivalTime: Date;
  @Expose() duration: number;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() status: FlightStatus;
  @Expose()
  @Type(() => AircraftResponseDto)
  aircraft: AircraftResponseDto;
  @Expose()
  @Type(() => AirlineResponseDto)
  airline: AirlineResponseDto;
  @Expose()
  @Type(() => AirportResponseDto)
  departureAirport: AirportResponseDto;
  @Expose()
  @Type(() => AirportResponseDto)
  arrivalAirport: AirportResponseDto;
}
