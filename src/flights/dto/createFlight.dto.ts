import { IsISO8601, IsNumber } from 'class-validator';

export class CreateFlightDto {
  @IsISO8601()
  departureTime: string;

  @IsISO8601()
  arrivalTime: string;

  @IsNumber()
  aircraftId: number;

  @IsNumber()
  departureAirportId: number;

  @IsNumber()
  arrivalAirportId: number;
}
