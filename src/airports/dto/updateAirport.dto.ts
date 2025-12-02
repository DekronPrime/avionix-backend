import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { AirportStatus } from 'src/common/enums/ariportStatus';

export class UpdateAirportDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  city: string;

  @IsOptional()
  @IsString()
  @Length(3)
  iataCode: string;

  @IsOptional()
  @IsEnum(AirportStatus)
  status?: AirportStatus;

  @IsOptional()
  @IsNumber()
  countryId: number;
}
