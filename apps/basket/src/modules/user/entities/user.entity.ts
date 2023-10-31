import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';
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
  @JoinTable({
    name: 'users_products',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products?: Product[];
}
