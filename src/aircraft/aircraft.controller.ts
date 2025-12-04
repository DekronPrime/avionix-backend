import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AircraftService } from './aircraft.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/userRole';
import { CreateAircraftDto } from './dto/createAircraft.dto';
import { UpdateAircraftDto } from './dto/updateAircraft.dto';
import { UpdateAircraftStatusDto } from './dto/updateAircraftStatus.dto';

@Controller('aircraft')
export class AircraftController {
  constructor(private readonly aircraftService: AircraftService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createAircraftDto: CreateAircraftDto) {
    return this.aircraftService.create(createAircraftDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.aircraftService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.aircraftService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateAircraftDto: UpdateAircraftDto,
  ) {
    return this.aircraftService.update(id, updateAircraftDto);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body() updateAircraftStatusdto: UpdateAircraftStatusDto,
  ) {
    return this.aircraftService.updateStatus(
      id,
      updateAircraftStatusdto.status,
    );
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.aircraftService.delete(id);
  }
}
