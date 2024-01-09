import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Product } from '../../product/entities';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'users', synchronize: true })
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn()
  id: number;

  @Field(() => [Product])
  @ManyToMany(() => Product, (product) => product.users)
  products?: Product[];
}
