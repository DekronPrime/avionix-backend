import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CrewAssignmentOwnerGuard } from 'src/auth/guards/crewAssignmentOwner.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/userRole';
import { CrewAssignmentService } from './crew-assignments.service';
import { CreateCrewAssignmentDto } from './dto/create-crew-assignment.dto';

@Controller('crew_assignments')
export class CrewAssignmentController {
  constructor(private readonly crewAssignmentService: CrewAssignmentService) {}

  @Public()
  @Get('availability')
  async checkAvailability(
    @Query('userId') userId: number,
    @Query('departureTime') departureTime: string,
    @Query('arrivalTime') arrivalTime: string,
    @Query('excludeAssignmentId') excludeAssignmentId?: number,
  ) {
    const isAvailable = await this.crewAssignmentService.isCrewAvailable(
      Number(userId),
      new Date(departureTime),
      new Date(arrivalTime),
      excludeAssignmentId ? Number(excludeAssignmentId) : undefined,
    );

    return {
      userId,
      departureTime,
      arrivalTime,
      isAvailable,
    };
  }

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateCrewAssignmentDto) {
    return this.crewAssignmentService.create(dto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.crewAssignmentService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.crewAssignmentService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Get('/by-flight/:flightId')
  getByFlight(@Param('flightId') flightId: number) {
    return this.crewAssignmentService.getByFlight(flightId);
  }

  @Roles(UserRole.CREW)
  @UseGuards(CrewAssignmentOwnerGuard)
  @Patch(':id/confirm')
  confirm(@Param('id') id: number) {
    return this.crewAssignmentService.confirm(id);
  }

  @Roles(UserRole.CREW)
  @UseGuards(CrewAssignmentOwnerGuard)
  @Patch(':id/decline')
  decline(@Param('id') id: number) {
    return this.crewAssignmentService.decline(id);
  }
}
