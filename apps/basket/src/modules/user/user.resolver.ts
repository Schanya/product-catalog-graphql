import { Resolver } from '@nestjs/graphql';

import { User } from './entities';

@Resolver(() => User)
export class UserResolver {}
