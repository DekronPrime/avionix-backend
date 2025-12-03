import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UpdateAirlineDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name: string;

  @IsOptional()
  @IsString()
  @Length(2)
  iataCode: string;

  @IsOptional()
  @IsNumber()
  countryId: number;
}
