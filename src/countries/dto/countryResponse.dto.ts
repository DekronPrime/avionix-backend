import { Expose } from 'class-transformer';

export class CountryResponseDto {
  @Expose() id: number;
  @Expose() name: string;
  @Expose() isoCode: string;
}
