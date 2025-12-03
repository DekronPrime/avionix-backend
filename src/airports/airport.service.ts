import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirportStatus } from 'src/common/enums/ariportStatus';
import { MapperService } from 'src/common/mappers/mapper.service';
import { CountryService } from 'src/countries/country.service';
import { Repository } from 'typeorm';
import { Airport } from './airport.entity';
import { AirportResponseDto } from './dto/airportResponse.dto';
import { CreateAirportDto } from './dto/createAirport.dto';
import { UpdateAirportDto } from './dto/updateAirport.dto';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(Airport)
    private readonly airportRepository: Repository<Airport>,
    private readonly countryService: CountryService,
    private readonly mapper: MapperService,
  ) {}

  async create(
    createAirportDto: CreateAirportDto,
  ): Promise<AirportResponseDto> {
    const airport = this.airportRepository.create({
      ...createAirportDto,
      country: await this.countryService.findById(createAirportDto.countryId),
      status: AirportStatus.ACTIVE,
    });

    const savedAirport = await this.airportRepository.save(airport);
    return this.mapper.toDto(AirportResponseDto, savedAirport);
  }

  async findAll(): Promise<AirportResponseDto[]> {
    const airports = await this.airportRepository.find({
      relations: ['country'],
      withDeleted: true,
    });

    return this.mapper.toDtos(AirportResponseDto, airports);
  }

  async findOne(id: number): Promise<AirportResponseDto> {
    const airport = await this.findAirportById(id);
    return this.mapper.toDto(AirportResponseDto, airport);
  }

  async update(
    id: number,
    updateAirportDto: UpdateAirportDto,
  ): Promise<AirportResponseDto> {
    const airport = await this.findAirportById(id);

    if (updateAirportDto.countryId !== undefined) {
      airport.country = await this.countryService.findById(
        updateAirportDto.countryId,
      );
    }

    const sanitizedDto = Object.fromEntries(
      Object.entries(updateAirportDto).filter(([_, v]) => v !== undefined),
    );
    Object.assign(airport, sanitizedDto);

    const updatedAirport = await this.airportRepository.save(airport);
    return this.mapper.toDto(AirportResponseDto, updatedAirport);
  }

  async updateStatus(
    id: number,
    status: AirportStatus,
  ): Promise<AirportResponseDto> {
    const airport = await this.findAirportById(id);
    airport.status = status;

    const updatedAirport = await this.airportRepository.save(airport);
    return this.mapper.toDto(AirportResponseDto, updatedAirport);
  }

  async delete(id: number): Promise<AirportResponseDto> {
    const airport = await this.findAirportById(id);
    airport.status = AirportStatus.CLOSED;

    const deletedAirport = await this.airportRepository.save(airport);
    return this.mapper.toDto(AirportResponseDto, deletedAirport);
  }

  private async findAirportById(id: number): Promise<Airport> {
    const airport = await this.airportRepository.findOne({
      where: { id },
      relations: ['country'],
      withDeleted: true,
    });

    if (!airport) {
      throw new NotFoundException(`Airport with id=${id} not found`);
    }

    return airport;
  }
}
