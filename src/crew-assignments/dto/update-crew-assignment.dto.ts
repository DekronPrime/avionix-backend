import { IsEnum, IsNumber } from 'class-validator';
import { CrewAssignmentPosition } from 'src/common/enums/crewAssignmentPosition';

export class UpdateCrewAssignmentDto {
  @IsNumber()
  flightId: number;

  @IsNumber()
  userId: number;

  @IsEnum(CrewAssignmentPosition)
  position: CrewAssignmentPosition;
}
