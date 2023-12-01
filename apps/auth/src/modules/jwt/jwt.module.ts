import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

import { JwtService } from './jwt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities';
import { UsersModule } from '../users/users.module';
import { getEnvironmentFile } from '@libs/common';

const DefineNestJwtModule = NestJwtModule.registerAsync({
  useFactory: async (configServie: ConfigService) => ({
    secret: configServie.get<string>('ACCESS_TOKEN_SECRET'),
    signOptions: {
      expiresIn: configServie.get<string>('ACCESS_TOKEN_EXPIRED'),
    },
  }),
  inject: [ConfigService],
});

const envFilePath = `./apps/auth/${getEnvironmentFile(process.env.NODE_ENV)}`;
const DefinitionConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: envFilePath,
});

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    DefineNestJwtModule,
    DefinitionConfigModule,
    UsersModule,
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
