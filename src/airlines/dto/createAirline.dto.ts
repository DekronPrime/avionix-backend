import { IsNumber, IsString, Length } from 'class-validator';

export class CreateAirlineDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsString()
  @Length(2)
  iataCode: string;

  @IsNumber()
  countryId: number;
}
