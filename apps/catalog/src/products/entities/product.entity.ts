import { ObjectType, Field, Int, Float, Directive } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
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

  @Field()
  @Column({ type: 'text' })
  currency: string;

  @Field(() => Int)
  @Column({ type: 'integer' })
  quantity: number;
}
