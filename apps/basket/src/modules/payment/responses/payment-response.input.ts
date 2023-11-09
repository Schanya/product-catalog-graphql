import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Payment {
  @Field()
  url: string;
}
