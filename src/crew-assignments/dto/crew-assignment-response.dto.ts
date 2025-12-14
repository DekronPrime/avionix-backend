import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/common/dto/userResponse.dto';
import { CrewAssignmentPosition } from 'src/common/enums/crewAssignmentPosition';
import { CrewAssignmentStatus } from 'src/common/enums/crewAssignmentStatus';
import { FlightResponseDto } from 'src/flights/dto/flightResponse.dto';

export class CrewAssignmentResponseDto {
  @Expose() id: number;
  @Expose() position: CrewAssignmentPosition;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() status: CrewAssignmentStatus;

  @Expose()
  @Type(() => FlightResponseDto)
  flight: FlightResponseDto;
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
