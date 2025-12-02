import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/userRole';
import { AirportService } from './airport.service';
import { CreateAirportDto } from './dto/createAirport.dto';
import { UpdateAirportDto } from './dto/updateAirport.dto';
import { UpdateAirportStatusDto } from './dto/updateAirportStatus.dto';

@Controller('airports')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createAirportDto: CreateAirportDto) {
    return this.airportService.create(createAirportDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.airportService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.airportService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAirportDto: UpdateAirportDto) {
    return this.airportService.update(id, updateAirportDto);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body() updateAirportStatusdto: UpdateAirportStatusDto,
  ) {
    return this.airportService.updateStatus(id, updateAirportStatusdto.status);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.airportService.delete(id);
  }
}
