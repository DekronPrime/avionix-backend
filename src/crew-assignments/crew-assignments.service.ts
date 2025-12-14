import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrewAssignmentPosition } from 'src/common/enums/crewAssignmentPosition';
import { CrewAssignmentStatus } from 'src/common/enums/crewAssignmentStatus';
import { FlightStatus } from 'src/common/enums/flightStatus';
import { UserRole } from 'src/common/enums/userRole';
import { MapperService } from 'src/common/mappers/mapper.service';
import { FlightService } from 'src/flights/flight.service';
import { UserService } from 'src/users/user.service';
import { Repository } from 'typeorm';
import { CrewAssignment } from './crew-assignments.entity';
import { CreateCrewAssignmentDto } from './dto/create-crew-assignment.dto';
import { CrewAssignmentResponseDto } from './dto/crew-assignment-response.dto';

@Injectable()
export class CrewAssignmentService {
  constructor(
    @InjectRepository(CrewAssignment)
    private readonly crewAssignmentRepository: Repository<CrewAssignment>,
    private readonly userService: UserService,
    private readonly flightService: FlightService,
    private readonly mapper: MapperService,
  ) {}

  async create(
    createCrewAssignmentDto: CreateCrewAssignmentDto,
  ): Promise<CrewAssignmentResponseDto> {
    const flight = await this.flightService.findFlightById(
      createCrewAssignmentDto.flightId,
    );
    const user = await this.userService.findUserById(
      createCrewAssignmentDto.userId,
    );

    if (!flight) throw new NotFoundException('Flight not found');
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== UserRole.CREW) {
      throw new BadRequestException('User is not a crew member');
    }
    if (user.position !== createCrewAssignmentDto.position)
      throw new BadRequestException('User position mismatch');

    await this.assertCrewAvailable(
      user.id,
      flight.departureTime,
      flight.arrivalTime,
    );

    const crewAssignment = this.crewAssignmentRepository.create({
      flight,
      user,
      position: createCrewAssignmentDto.position,
      status: CrewAssignmentStatus.ASSIGNED,
    });
    const savedCrewAssignment =
      this.crewAssignmentRepository.save(crewAssignment);

    if (
      flight.status !== FlightStatus.AWAITING_CREW &&
      flight.status !== FlightStatus.CANCELLED
    ) {
      await this.flightService.updateStatus(
        createCrewAssignmentDto.flightId,
        FlightStatus.AWAITING_CREW,
      );
    }

    return this.mapper.toDto(CrewAssignmentResponseDto, savedCrewAssignment);
  }

  async findAll(): Promise<CrewAssignmentResponseDto[]> {
    const crewAssignments = await this.crewAssignmentRepository.find({
      relations: ['flight', 'user'],
      withDeleted: true,
    });

    return this.mapper.toDtos(CrewAssignmentResponseDto, crewAssignments);
  }

  async findOne(id: number): Promise<CrewAssignmentResponseDto> {
    const crewAssignment = await this.findCrewAssignmentById(id);
    return this.mapper.toDto(CrewAssignmentResponseDto, crewAssignment);
  }

  async confirm(id: number): Promise<CrewAssignmentResponseDto> {
    const crewAssignment = await this.findCrewAssignmentById(id);

    if (crewAssignment.status === CrewAssignmentStatus.CANCELLED) {
      throw new BadRequestException('Cannot confirm cancelled assignment');
    }

    crewAssignment.status = CrewAssignmentStatus.CONFIRMED;
    const updated = await this.crewAssignmentRepository.save(crewAssignment);

    await this.tryMarkFlightReady(crewAssignment.flight.id);

    return this.mapper.toDto(CrewAssignmentResponseDto, updated);
  }

  async decline(id: number): Promise<CrewAssignmentResponseDto> {
    const crewAssignment = await this.findCrewAssignmentById(id);

    if (crewAssignment.status === CrewAssignmentStatus.CONFIRMED) {
      throw new BadRequestException('Confirmed assignment cannot be declined');
    }

    crewAssignment.status = CrewAssignmentStatus.CANCELLED;

    const updated = await this.crewAssignmentRepository.save(crewAssignment);

    await this.flightService.updateStatus(
      crewAssignment.flight.id,
      FlightStatus.AWAITING_CREW,
    );

    return this.mapper.toDto(CrewAssignmentResponseDto, updated);
  }

  async getByFlight(flightId: number) {
    await this.tryMarkFlightReady(flightId);
    return this.crewAssignmentRepository.find({
      where: { flight: { id: flightId } },
      relations: { user: true },
    });
  }

  async isCrewAvailable(
    userId: number,
    departureTime: Date,
    arrivalTime: Date,
    excludeAssignmentId?: number,
  ): Promise<boolean> {
    const qb = this.crewAssignmentRepository
      .createQueryBuilder('ca')
      .leftJoin('ca.flight', 'flight')
      .where('ca.user_id = :userId', { userId })
      .andWhere('flight.status != :cancelled', {
        cancelled: FlightStatus.CANCELLED,
      });

    if (excludeAssignmentId) {
      qb.andWhere('ca.id != :excludeId', {
        excludeId: excludeAssignmentId,
      });
    }

    qb.andWhere(
      `(:departureTime < flight.arrival_time)
     AND (:arrivalTime > flight.departure_time)`,
      { departureTime, arrivalTime },
    );

    const conflict = await qb.getOne();
    return !conflict;
  }

  async assertCrewAvailable(
    userId: number,
    departureTime: Date,
    arrivalTime: Date,
    excludeAssignmentId?: number,
  ): Promise<void> {
    const isAvailable = await this.isCrewAvailable(
      userId,
      departureTime,
      arrivalTime,
      excludeAssignmentId,
    );

    if (!isAvailable) {
      throw new BadRequestException(
        'Crew member is busy during this time window',
      );
    }
  }

  async tryMarkFlightReady(flightId: number) {
    const crewAssignments = await this.crewAssignmentRepository.find({
      where: {
        flight: { id: flightId },
      },
    });

    if (crewAssignments.length === 0) {
      await this.flightService.updateStatus(
        flightId,
        FlightStatus.AWAITING_CREW,
      );
      return;
    }

    const requiredPositions = Object.values(CrewAssignmentPosition);

    const confirmedAssignments = crewAssignments.filter(
      (a) => a.status === CrewAssignmentStatus.CONFIRMED,
    );

    const confirmedPositions = new Set(
      confirmedAssignments.map((a) => a.position),
    );

    const allPositionsFilled = requiredPositions.every((pos) =>
      confirmedPositions.has(pos),
    );

    if (allPositionsFilled) {
      await this.flightService.updateStatus(flightId, FlightStatus.SCHEDULED);
    } else {
      await this.flightService.updateStatus(
        flightId,
        FlightStatus.AWAITING_CREW,
      );
    }
  }

  async findCrewAssignmentById(id: number): Promise<CrewAssignment> {
    const crewAssignment = await this.crewAssignmentRepository.findOne({
      where: { id },
      relations: ['flight', 'user'],
      withDeleted: true,
    });

    if (!crewAssignment)
      throw new NotFoundException(`Crew assignment with id=${id} not found`);
    return crewAssignment;
  }
}
