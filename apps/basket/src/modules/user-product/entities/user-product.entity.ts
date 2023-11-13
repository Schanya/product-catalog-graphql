import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from '../../product/entities';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'users_products', synchronize: true })
export class UsersProducts extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @Field(() => Int)
  @PrimaryColumn({ name: 'product_id' })
  productId: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  amount: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  users: User;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.users)
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'id' }])
  products: Product;
}
