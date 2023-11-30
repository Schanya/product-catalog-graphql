import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

import { RedisService } from './redis.service';

const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (config: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: config.get<string>('REDIS_HOST'),
        port: config.get<number>('REDIS_PORT'),
      },
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};

const DefinitionCacheModule = CacheModule.registerAsync(RedisOptions);

@Module({
  imports: [ConfigModule, DefinitionCacheModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
