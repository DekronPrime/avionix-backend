import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UpdateAircraftDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  model: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsNumber()
  airlineId: number;
}
