import { Currency } from '@libs/common';
import {
  ObjectType,
  Field,
  Int,
  Float,
  Directive,
  registerEnumType,
} from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

registerEnumType(Currency, {
  name: 'Currency',
});

@ObjectType()
@Directive('@shareable')
@Directive('@key(fields: "id")')
@Entity('products', { synchronize: true })
export class Product extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
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
}
