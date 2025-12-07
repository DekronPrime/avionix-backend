import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Aircraft } from './aircraft.entity';
import { Repository } from 'typeorm';
import { AirlineService } from 'src/airlines/airline.service';
import { MapperService } from 'src/common/mappers/mapper.service';
import { CreateAircraftDto } from './dto/createAircraft.dto';
import { AircraftResponseDto } from './dto/aircraftResponse.dto';
import { AircraftStatus } from 'src/common/enums/aircraftStatus';
import { UpdateAircraftDto } from './dto/updateAircraft.dto';

@Injectable()
export class AircraftService {
  constructor(
    @InjectRepository(Aircraft)
    private readonly aircraftRepository: Repository<Aircraft>,
    private readonly airlineService: AirlineService,
    private readonly mapper: MapperService,
  ) {}

  async create(
    createAircraftDto: CreateAircraftDto,
  ): Promise<AircraftResponseDto> {
    const aircraft = this.aircraftRepository.create({
      ...createAircraftDto,
      airline: await this.airlineService.findOne(createAircraftDto.airlineId),
      status: AircraftStatus.AVAILABLE,
    });

    const savedAircraft = await this.aircraftRepository.save(aircraft);
    return this.mapper.toDto(AircraftResponseDto, savedAircraft);
  }

  async findAll(): Promise<AircraftResponseDto[]> {
    const aircraft = await this.aircraftRepository.find({
      relations: ['airline', 'airline.country'],
      withDeleted: true,
    });

    return this.mapper.toDtos(AircraftResponseDto, aircraft);
  }

  async findOne(id: number): Promise<AircraftResponseDto> {
    const aircraft = await this.findAircraftById(id);
    return this.mapper.toDto(AircraftResponseDto, aircraft);
  }

  async update(
    id: number,
    updateAircraftDto: UpdateAircraftDto,
  ): Promise<AircraftResponseDto> {
    const aircraft = await this.findAircraftById(id);

    if (updateAircraftDto.airlineId !== undefined) {
      aircraft.airline = await this.airlineService.findAirlineById(
        updateAircraftDto.airlineId,
      );
    }

    const sanitizedDto = Object.fromEntries(
      Object.entries(updateAircraftDto).filter(([_, v]) => v !== undefined),
    );
    Object.assign(aircraft, sanitizedDto);

    const updatedAircraft = await this.aircraftRepository.save(aircraft);
    return this.mapper.toDto(AircraftResponseDto, updatedAircraft);
  }

  async updateStatus(
    id: number,
    status: AircraftStatus,
  ): Promise<AircraftResponseDto> {
    const aircraft = await this.findAircraftById(id);
    aircraft.status = status;

    const updatedAircraft = await this.aircraftRepository.save(aircraft);
    return this.mapper.toDto(AircraftResponseDto, updatedAircraft);
  }

  async delete(id: number): Promise<AircraftResponseDto> {
    const aircraft = await this.findAircraftById(id);
    aircraft.status = AircraftStatus.DECOMMISSIONED;

    const deletedAircraft = await this.aircraftRepository.save(aircraft);
    return this.mapper.toDto(AircraftResponseDto, deletedAircraft);
  }

  async findAircraftById(id: number): Promise<Aircraft> {
    const aircraft = await this.aircraftRepository.findOne({
      where: { id },
      relations: ['airline', 'airline.country'],
      withDeleted: true,
    });

    if (!aircraft) {
      throw new NotFoundException(`Aircraft with id=${id} not found`);
    }

    return aircraft;
  }
}
