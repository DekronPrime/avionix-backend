import { IsEnum, IsNumber } from 'class-validator';
import { CrewAssignmentPosition } from 'src/common/enums/crewAssignmentPosition';

export class CreateCrewAssignmentDto {
  @IsNumber()
  flightId: number;

  @IsNumber()
  userId: number;

  @IsEnum(CrewAssignmentPosition)
  position: CrewAssignmentPosition;
}
