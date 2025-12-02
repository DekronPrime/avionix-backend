import { IsEnum } from 'class-validator';
import { AirportStatus } from 'src/common/enums/ariportStatus';

export class UpdateAirportStatusDto {
  @IsEnum(AirportStatus)
  status: AirportStatus;
}
