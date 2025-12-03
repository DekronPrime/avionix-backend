import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AirlineService } from './airline.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/userRole';
import { CreateAirlineDto } from './dto/createAirline.dto';
import { UpdateAirlineDto } from './dto/updateAirline.dto';
import { UpdateAirlineStatusDto } from './dto/updateAirlineStatus.dto';

@Controller('airlines')
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createAirlineDto: CreateAirlineDto) {
    return this.airlineService.create(createAirlineDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.airlineService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.airlineService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAirlineDto: UpdateAirlineDto) {
    return this.airlineService.update(id, updateAirlineDto);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body() updateAirlineStatusdto: UpdateAirlineStatusDto,
  ) {
    return this.airlineService.updateStatus(id, updateAirlineStatusdto.status);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.airlineService.delete(id);
  }
}
