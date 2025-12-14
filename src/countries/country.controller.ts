import { Controller, Get, Param } from '@nestjs/common';
import { CountryService } from './country.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Public()
  @Get()
  findAll() {
    return this.countryService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.countryService.findById(id);
  }
}
