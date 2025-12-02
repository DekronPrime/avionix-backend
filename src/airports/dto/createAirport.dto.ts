import { IsNumber, IsString, Length } from 'class-validator';

export class CreateAirportDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsString()
  @Length(3, 100)
  city: string;

  @IsString()
  @Length(3)
  iataCode: string;

  @IsNumber()
  countryId: number;
}
