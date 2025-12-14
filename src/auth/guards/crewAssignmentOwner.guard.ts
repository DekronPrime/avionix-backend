import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CrewAssignmentService } from 'src/crew-assignments/crew-assignments.service';

@Injectable()
export class CrewAssignmentOwnerGuard implements CanActivate {
  constructor(private readonly crewAssignmentService: CrewAssignmentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const assignmentId = request.params.id;

    if (!user) {
      throw new ForbiddenException('Unauthenticated');
    }

    const assignment =
      await this.crewAssignmentService.findCrewAssignmentById(assignmentId);

    console.log({
      assignmentUserId: assignment.user.id,
      requestUserId: user.id,
      types: {
        assignment: typeof assignment.user.id,
        user: typeof user.id,
      },
    });

    if (Number(assignment.user.id) !== Number(user.id)) {
      throw new ForbiddenException('This is not your crew assignment');
    }

    return true;
  }
}
