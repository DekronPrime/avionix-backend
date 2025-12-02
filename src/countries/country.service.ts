import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './country.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async findAll(): Promise<Country[]> {
    return this.countryRepository.find();
  }

  async findById(id: number): Promise<Country> {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country)
      throw new NotFoundException(`Country with id=${id} not found`);
    return country;
  }
}
