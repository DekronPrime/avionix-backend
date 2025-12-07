import { IsEnum } from 'class-validator';
import { FlightStatus } from 'src/common/enums/flightStatus';

export class UpdateFlightStatusDto {
  @IsEnum(FlightStatus)
  status: FlightStatus;
}
