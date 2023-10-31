import { Directive, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities';

@ObjectType()
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

  @Field()
  @Column({ type: 'text' })
  currency: string;

  @Field(() => Int)
  @Column({ type: 'integer' })
  quantity: number;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.products)
  users?: User[];
}
