import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './config/orm.config';
import { UserModule } from './users/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGlobalGuard } from './common/guards/jwtGlobal.guard';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    UserModule,
    AuthModule,
    CommonModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGlobalGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
