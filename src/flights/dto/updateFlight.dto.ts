import { IsDate, IsISO8601, IsNumber } from 'class-validator';

export class UpdateFlightDto {
  @IsISO8601()
  departureTime: Date;

  @IsISO8601()
  arrivalTime: Date;

  @IsNumber()
  aircraftId: number;

  @IsNumber()
  departureAirportId: number;

  @IsNumber()
  arrivalAirportId: number;
}
