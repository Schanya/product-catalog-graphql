import { Module } from '@nestjs/common';
import { KafkaModule } from '@libs/common';

const DefinitionKafkaModule = KafkaModule.register({
  name: 'AUTH',
});

@Module({
  imports: [DefinitionKafkaModule],
  controllers: [],
  providers: [],
})
export class AuthModule {}
