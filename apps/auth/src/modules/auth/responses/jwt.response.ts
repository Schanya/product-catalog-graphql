import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JwtResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
