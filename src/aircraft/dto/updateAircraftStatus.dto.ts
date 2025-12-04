import { IsEnum } from 'class-validator';
import { AircraftStatus } from 'src/common/enums/aircraftStatus';

export class UpdateAircraftStatusDto {
  @IsEnum(AircraftStatus)
  status: AircraftStatus;
}
