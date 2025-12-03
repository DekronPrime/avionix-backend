import { Expose, Type } from 'class-transformer';
import { AirlineStatus } from 'src/common/enums/airlinesStatus';
import { CountryResponseDto } from 'src/countries/dto/countryResponse.dto';

export class AirlineResponseDto {
  @Expose() id: number;
  @Expose() name: string;
  @Expose() iataCode: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() status: AirlineStatus;
  @Expose()
  @Type(() => CountryResponseDto)
  country: CountryResponseDto;
}
