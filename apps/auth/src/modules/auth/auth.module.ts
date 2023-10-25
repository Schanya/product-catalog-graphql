import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { JwtModule } from '../jwt/jwt.module';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

import { LocalStrategy } from './strategies';

@Module({
  imports: [PassportModule, UsersModule, JwtModule],
  providers: [AuthResolver, AuthService, LocalStrategy],
})
export class AuthModule {}
