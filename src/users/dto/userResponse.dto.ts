import { Expose, Type } from 'class-transformer';
import { UserRole } from 'src/common/enums/userRole';
import { UserStatus } from 'src/common/enums/userStatus';
import { CountryResponseDto } from 'src/countries/dto/countryResponse.dto';

export class UserResponseDto {
  @Expose() id: number;
  @Expose() username: string;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() birthDate: string;
  @Expose() passportNumber: string;
  @Expose() role: UserRole;
  @Expose() email: string;
  @Expose() phone?: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() status: UserStatus;
  @Expose()
  @Type(() => CountryResponseDto)
  nationality?: CountryResponseDto;
}
