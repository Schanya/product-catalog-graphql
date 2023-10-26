import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { JwtModule } from '../jwt/jwt.module';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

import { LocalStrategy } from './strategies';
import { SessionSerializer } from './utils';

@Module({
  imports: [PassportModule.register({ session: true }), UsersModule, JwtModule],
  providers: [AuthResolver, AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
