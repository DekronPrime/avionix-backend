import { IsEnum } from 'class-validator';
import { CrewAssignmentPosition } from 'src/common/enums/crewAssignmentPosition';

export class UpdateUserPositionDto {
  @IsEnum(CrewAssignmentPosition)
  position: CrewAssignmentPosition;
}
