import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MapperService {
  toDto<T, V>(dtoClass: new (...args: any[]) => T, entity: V): T {
    return plainToInstance(dtoClass, entity, { excludeExtraneousValues: true });
  }

  toDtos<T, V>(dtoClass: new (...args: any[]) => T, entities: V[]): T[] {
    return entities.map((e) =>
      plainToInstance(dtoClass, e, { excludeExtraneousValues: true }),
    );
  }
}
