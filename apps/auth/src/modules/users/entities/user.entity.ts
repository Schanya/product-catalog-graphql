import { ObjectType, Field, Int, Directive } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Token } from '../../jwt/entities/token.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'users', synchronize: true })
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'text' })
  login: string;

  @Field()
  @Column({ type: 'text', unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'text' })
  password: string;

  @Exclude()
  @Column({ type: 'text' })
  passwordSalt: string;

  @Field()
  @Column({ type: 'text' })
  role: string;

  @OneToMany(() => Token, (token: Token) => token.user)
  tokens: Token[];
}
