import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AircraftService } from 'src/aircraft/aircraft.service';
import { AirportService } from 'src/airports/airport.service';
import {
  BOARDING_MINUTES,
  DEFAULT_AVAILABLE_AIRCRAFT_HOURS,
  TURNAROUND_MINUTES,
} from 'src/common/constants/constants';
import { FlightStatus } from 'src/common/enums/flightStatus';
import { MapperService } from 'src/common/mappers/mapper.service';
import { Repository } from 'typeorm';
import { CreateFlightDto } from './dto/createFlight.dto';
import { FlightResponseDto } from './dto/flightResponse.dto';
import { UpdateFlightDto } from './dto/updateFlight.dto';
import { Flight } from './flight.entity';

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
    private readonly aircraftService: AircraftService,
    private readonly airportService: AirportService,
    private readonly mapper: MapperService,
  ) {}

  async getNextFlightNumber(airlineId: number): Promise<number> {
    const result = await this.flightRepository
      .createQueryBuilder('flight')
      .select('MAX(flight.flightNumber)', 'max')
      .where('flight.airline_id = :airlineId', { airlineId })
      .withDeleted()
      .getRawOne();

    const max = result?.max ? Number(result.max) : 100;
    return max + 1;
  }

  buildFlightCode(iata: string, number: number): string {
    return `${iata}-${number}`;
  }

  async checkAircraftAvailability(
    aircraftId: number,
    departureTime: Date,
    arrivalTime: Date,
  ): Promise<void> {
    const conflict = await this.flightRepository
      .createQueryBuilder('flight')
      .where('flight.aircraft_id = :aircraftId', { aircraftId })
      .andWhere(
        `
      (
        :departureTime < flight.arrival_time + INTERVAL '${TURNAROUND_MINUTES} minutes'
        AND
        :arrivalTime > flight.departure_time
      )
        `,
      )
      .setParameters({
        departureTime,
        arrivalTime,
      })
      .getOne();

    if (conflict) {
      throw new BadRequestException(
        'Aircraft is not available during the selected time window.',
      );
    }
  }

  normalizeToUtc(date: Date): Date {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }

  computeDynamicStatus(
    departure: Date,
    arrival: Date,
    baseStatus: FlightStatus,
    now: Date = new Date(),
  ): FlightStatus {
    if (baseStatus === FlightStatus.CANCELLED) return FlightStatus.CANCELLED;
    else if (baseStatus === FlightStatus.COMPLETED)
      return FlightStatus.COMPLETED;
    else if (baseStatus === FlightStatus.AWAITING_CREW)
      return FlightStatus.AWAITING_CREW;

    const current = this.normalizeToUtc(now);

    const boardingStart = new Date(
      departure.getTime() - BOARDING_MINUTES * 60000,
    );

    if (current < boardingStart) return FlightStatus.SCHEDULED;
    if (current >= boardingStart && current < departure)
      return FlightStatus.BOARDING;
    if (current >= departure && current < arrival) return FlightStatus.IN_AIR;
    if (current >= arrival) return FlightStatus.LANDED;

    return FlightStatus.SCHEDULED;
  }

  applyDynamicStatus(flight: Flight): Flight {
    flight.status = this.computeDynamicStatus(
      flight.departureTime,
      flight.arrivalTime,
      flight.status,
    );

    return flight;
  }

  applyDynamicToMany(flights: Flight[]): Flight[] {
    return flights.map((flight) => this.applyDynamicStatus(flight));
  }

  async create(createFlightDto: CreateFlightDto): Promise<FlightResponseDto> {
    const { aircraftId, departureAirportId, arrivalAirportId } =
      createFlightDto;

    const aircraft = await this.aircraftService.findAircraftById(aircraftId);
    const airline = aircraft.airline;

    if (!airline) {
      throw new BadRequestException('This aircraft has no airline assigned.');
    }

    const departureAirport =
      await this.airportService.findAirportById(departureAirportId);
    const arrivalAirport =
      await this.airportService.findAirportById(arrivalAirportId);

    const departureTime = new Date(createFlightDto.departureTime);
    const arrivalTime = new Date(createFlightDto.arrivalTime);

    const now = new Date();

    if (departureTime <= now) {
      throw new BadRequestException('Departure time must be in the future.');
    }

    if (arrivalTime <= departureTime) {
      throw new BadRequestException(
        'Arrival time must be later than departure time.',
      );
    }

    await this.checkAircraftAvailability(
      aircraftId,
      departureTime,
      arrivalTime,
    );

    const duration = Math.floor(
      (arrivalTime.getTime() - departureTime.getTime()) / 60000,
    );

    const flightNumber = await this.getNextFlightNumber(airline.id);
    const flightCode = this.buildFlightCode(airline.iataCode, flightNumber);

    const status = FlightStatus.SCHEDULED;

    const flight = this.flightRepository.create({
      ...createFlightDto,
      departureTime,
      arrivalTime,
      aircraft,
      airline,
      departureAirport,
      arrivalAirport,
      flightNumber,
      flightCode,
      status,
      duration,
    });

    const savedFlight = await this.flightRepository.save(flight);

    return this.mapper.toDto(FlightResponseDto, savedFlight);
  }

  async findAll(): Promise<FlightResponseDto[]> {
    const flights = await this.flightRepository.find({
      relations: [
        'aircraft',
        'airline',
        'airline.country',
        'departureAirport',
        'departureAirport.country',
        'arrivalAirport',
        'arrivalAirport.country',
      ],
      withDeleted: true,
    });

    const updated = this.applyDynamicToMany(flights);

    return this.mapper.toDtos(FlightResponseDto, updated);
  }

  async findOne(id: number): Promise<FlightResponseDto> {
    const flight = await this.findFlightById(id);
    this.applyDynamicStatus(flight);
    return this.mapper.toDto(FlightResponseDto, flight);
  }

  async update(id: number, dto: UpdateFlightDto): Promise<FlightResponseDto> {
    const flight = await this.findFlightById(id);
    const now = this.normalizeToUtc(new Date());

    const departureTime = new Date(dto.departureTime);
    const arrivalTime = new Date(dto.arrivalTime);

    if (arrivalTime <= departureTime) {
      throw new BadRequestException(
        'Arrival time must be later than departure time.',
      );
    }

    if (departureTime < now) {
      throw new BadRequestException('Departure time must not be in the past.');
    }

    let aircraft = flight.aircraft;
    let airline = flight.airline;

    if (dto.aircraftId && dto.aircraftId !== flight.aircraft.id) {
      aircraft = await this.aircraftService.findAircraftById(dto.aircraftId);
      airline = aircraft.airline;

      if (!airline) {
        throw new BadRequestException('This aircraft has no airline assigned.');
      }

      await this.checkAircraftAvailability(
        dto.aircraftId,
        departureTime,
        arrivalTime,
      );
    } else {
      await this.checkAircraftAvailability(
        flight.aircraft.id,
        departureTime,
        arrivalTime,
      );
    }

    const departureAirport = dto.departureAirportId
      ? await this.airportService.findAirportById(dto.departureAirportId)
      : flight.departureAirport;

    const arrivalAirport = dto.arrivalAirportId
      ? await this.airportService.findAirportById(dto.arrivalAirportId)
      : flight.arrivalAirport;

    const duration = Math.floor(
      (arrivalTime.getTime() - departureTime.getTime()) / 60000,
    );

    const updated = await this.flightRepository.save({
      ...flight,
      departureTime,
      arrivalTime,
      departureAirport,
      arrivalAirport,
      aircraft,
      airline,
      duration,
    });

    return this.mapper.toDto(FlightResponseDto, updated);
  }

  async updateStatus(
    id: number,
    status: FlightStatus,
  ): Promise<FlightResponseDto> {
    const flight = await this.findFlightById(id);
    if (
      status !== FlightStatus.AWAITING_CREW &&
      status !== FlightStatus.SCHEDULED &&
      status !== FlightStatus.CANCELLED &&
      status !== FlightStatus.COMPLETED
    )
      throw new BadRequestException(
        'status must be one of the following values: AWAITING_CREW, SCHEDULED, CANCELLED, COMPLETED',
      );
    flight.status = status;

    const updatedFlight = await this.flightRepository.save(flight);
    return this.mapper.toDto(FlightResponseDto, updatedFlight);
  }

  async delete(id: number): Promise<FlightResponseDto> {
    const flight = await this.findFlightById(id);
    flight.status = FlightStatus.CANCELLED;

    const deletedFlightt = await this.flightRepository.save(flight);
    return this.mapper.toDto(FlightResponseDto, deletedFlightt);
  }

  async getNextAvailableTimeForAircraft(aircraftId: number): Promise<Date> {
    const lastFlight = await this.flightRepository
      .createQueryBuilder('flight')
      .where('flight.aircraft_id = :aircraftId', { aircraftId })
      .orderBy('flight.arrivalTime', 'DESC')
      .getOne();

    if (!lastFlight) {
      const now = new Date();
      const defaultTime = now.setHours(
        now.getHours() + DEFAULT_AVAILABLE_AIRCRAFT_HOURS,
      );
      return this.normalizeToUtc(new Date(defaultTime));
    }

    const arrival = new Date(lastFlight.arrivalTime);
    const available = new Date(arrival.getTime() + TURNAROUND_MINUTES * 60000);

    return available;
  }

  async findFlightById(id: number): Promise<Flight> {
    const flight = await this.flightRepository.findOne({
      where: { id },
      relations: [
        'aircraft',
        'airline',
        'airline.country',
        'departureAirport',
        'departureAirport.country',
        'arrivalAirport',
        'arrivalAirport.country',
      ],
      withDeleted: true,
    });

    if (!flight) throw new NotFoundException(`Flight with id=${id} not found`);
    return flight;
  }
}
