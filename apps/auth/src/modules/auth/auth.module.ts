import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { SessionSerializer } from '@libs/common';

import { JwtModule } from '../jwt/jwt.module';
import { UsersModule } from '../users/users.module';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

import { LocalStrategy, RefreshStrategy } from './strategies';

@Module({
  imports: [PassportModule.register({ session: true }), UsersModule, JwtModule],
  providers: [
    AuthResolver,
    AuthService,
    LocalStrategy,
    RefreshStrategy,
    SessionSerializer,
  ],
  exports: [PassportModule],
})
export class AuthModule {}
