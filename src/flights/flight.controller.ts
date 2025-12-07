import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FlightService } from './flight.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/userRole';
import { CreateFlightDto } from './dto/createFlight.dto';
import { UpdateFlightDto } from './dto/updateFlight.dto';
import { UpdateFlightStatusDto } from './dto/updateFlightStatus.dto';

@Controller('flights')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get('aircraft/:id/next_available')
  async getNextAvailable(@Param('id') id: number) {
    const time = await this.flightService.getNextAvailableTimeForAircraft(id);
    return { availableFrom: time };
  }

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createFlightDto: CreateFlightDto) {
    return this.flightService.create(createFlightDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.flightService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.flightService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateFlightDto: UpdateFlightDto) {
    return this.flightService.update(id, updateFlightDto);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body() updateFlightStatusDto: UpdateFlightStatusDto,
  ) {
    return this.flightService.updateStatus(id, updateFlightStatusDto.status);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.flightService.delete(id);
  }
}
