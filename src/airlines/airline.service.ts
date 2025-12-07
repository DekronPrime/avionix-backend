import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Airline } from './airline.entity';
import { Repository } from 'typeorm';
import { CountryService } from 'src/countries/country.service';
import { MapperService } from 'src/common/mappers/mapper.service';
import { CreateAirlineDto } from './dto/createAirline.dto';
import { AirlineResponseDto } from './dto/airlineResponse.dto';
import { AirlineStatus } from 'src/common/enums/airlinesStatus';
import { UpdateAirlineDto } from './dto/updateAirline.dto';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(Airline)
    private readonly airlineRepository: Repository<Airline>,
    private readonly countryService: CountryService,
    private readonly mapper: MapperService,
  ) {}

  async create(
    createAirlineDto: CreateAirlineDto,
  ): Promise<AirlineResponseDto> {
    const airline = this.airlineRepository.create({
      ...createAirlineDto,
      country: await this.countryService.findById(createAirlineDto.countryId),
      status: AirlineStatus.ACTIVE,
    });

    const savedAirline = await this.airlineRepository.save(airline);
    return this.mapper.toDto(AirlineResponseDto, savedAirline);
  }

  async findAll(): Promise<AirlineResponseDto[]> {
    const airlines = await this.airlineRepository.find({
      relations: ['country'],
      withDeleted: true,
    });

    return this.mapper.toDtos(AirlineResponseDto, airlines);
  }

  async findOne(id: number): Promise<AirlineResponseDto> {
    const airline = await this.findAirlineById(id);
    return this.mapper.toDto(AirlineResponseDto, airline);
  }

  async update(
    id: number,
    updateAirlineDto: UpdateAirlineDto,
  ): Promise<AirlineResponseDto> {
    const airline = await this.findAirlineById(id);

    if (updateAirlineDto.countryId !== undefined) {
      airline.country = await this.countryService.findById(
        updateAirlineDto.countryId,
      );
    }

    const sanitizedDto = Object.fromEntries(
      Object.entries(updateAirlineDto).filter(([_, v]) => v !== undefined),
    );
    Object.assign(airline, sanitizedDto);

    const updatedAirline = await this.airlineRepository.save(airline);
    return this.mapper.toDto(AirlineResponseDto, updatedAirline);
  }

  async updateStatus(
    id: number,
    status: AirlineStatus,
  ): Promise<AirlineResponseDto> {
    const airline = await this.findAirlineById(id);
    airline.status = status;

    const updatedAirline = await this.airlineRepository.save(airline);
    return this.mapper.toDto(AirlineResponseDto, updatedAirline);
  }

  async delete(id: number): Promise<AirlineResponseDto> {
    const airline = await this.findAirlineById(id);
    airline.status = AirlineStatus.CLOSED;

    const deletedAirline = await this.airlineRepository.save(airline);
    return this.mapper.toDto(AirlineResponseDto, deletedAirline);
  }

  async findAirlineById(id: number): Promise<Airline> {
    const airline = await this.airlineRepository.findOne({
      where: { id },
      relations: ['country'],
      withDeleted: true,
    });

    if (!airline) {
      throw new NotFoundException(`Airline with id=${id} not found`);
    }

    return airline;
  }
}
