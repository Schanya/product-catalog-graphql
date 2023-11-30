import {
  Directive,
  Field,
  Float,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities';

export enum Currency {
  USD = 'USD',
  RUB = 'RUB',
}

registerEnumType(Currency, {
  name: 'Currency',
});

@ObjectType()
@Directive('@shareable')
@Directive('@key(fields: "id")')
@Entity('products', { synchronize: true })
export class Product extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn()
  id: number;

  @Field()
  @Column({ type: 'text', nullable: false })
  title: string;

  @Field(() => Float)
  @Column({ type: 'real' })
  price: number;

  @Field(() => Currency)
  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.USD,
  })
  currency: string;

  @Field(() => Int)
  @Column({ type: 'integer' })
  quantity: number;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.products)
  users?: User[];
}
