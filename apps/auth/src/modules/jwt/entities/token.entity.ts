import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity({ name: 'tokens', synchronize: true })
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  refreshToken: string;

  @Column({ type: 'timestamp' })
  expirationDate: Date;

  @ManyToOne(() => User, (user: User) => user.tokens)
  user: User;
}
