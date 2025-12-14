import { IsEnum } from 'class-validator';
import { CrewAssignmentStatus } from 'src/common/enums/crewAssignmentStatus';

export class UpdateCrewAssignmentStatusDto {
  @IsEnum(CrewAssignmentStatus)
  status: CrewAssignmentStatus;
}
