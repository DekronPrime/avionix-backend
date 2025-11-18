import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/common/dto/userResponse.dto';

export class AuthResponseDto {
  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty()
  token: string;
}
