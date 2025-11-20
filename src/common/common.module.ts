import { Module } from '@nestjs/common';
import { MapperService } from './mappers/mapper.service';

@Module({
  providers: [MapperService],
  exports: [MapperService],
})
export class CommonModule {}
