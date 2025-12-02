import { Expose, Type } from 'class-transformer';
import { AirportStatus } from 'src/common/enums/ariportStatus';
import { CountryResponseDto } from 'src/countries/dto/countryResponse.dto';

export class AirportResponseDto {
  @Expose() id: number;
  @Expose() name: string;
  @Expose() city: string;
  @Expose() iataCode: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() status: AirportStatus;
  @Expose()
  @Type(() => CountryResponseDto)
  country: CountryResponseDto;
}
