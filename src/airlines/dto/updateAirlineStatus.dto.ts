import { IsEnum } from 'class-validator';
import { AirlineStatus } from 'src/common/enums/airlinesStatus';

export class UpdateAirlineStatusDto {
  @IsEnum(AirlineStatus)
  status: AirlineStatus;
}
