import { Transform, Type } from 'class-transformer';
import { IsISO8601, IsNumber } from 'class-validator';

export class CreateFlightDto {
  //   @Type(() => Date)
  //   @IsISO8601()
  //   departureTime: Date;

  //   @Type(() => Date)
  //   @IsISO8601()
  //   arrivalTime: Date;

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
