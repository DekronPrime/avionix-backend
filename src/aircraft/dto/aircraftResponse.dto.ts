import { Expose, Type } from 'class-transformer';
import { AirlineResponseDto } from 'src/airlines/dto/airlineResponse.dto';
import { AircraftStatus } from 'src/common/enums/aircraftStatus';

export class AircraftResponseDto {
  @Expose() id: number;
  @Expose() model: string;
  @Expose() capacity: number;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() status: AircraftStatus;
  @Expose()
  @Type(() => AirlineResponseDto)
  airline: AircraftResponseDto;
}
