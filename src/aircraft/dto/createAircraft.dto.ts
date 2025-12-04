import { IsInt, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateAircraftDto {
  @IsString()
  @Length(2, 100)
  model: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsNumber()
  airlineId: number;
}
