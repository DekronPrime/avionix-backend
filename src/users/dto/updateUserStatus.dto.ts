import { IsEnum } from 'class-validator';
import { UserStatus } from 'src/common/enums/userStatus';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  status: UserStatus;
}
