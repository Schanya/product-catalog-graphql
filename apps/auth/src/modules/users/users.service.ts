import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Role, getRepositoryFromTransaction } from '@libs/common';

import { CreateUserInput, FindUserInput } from './dto';
import { User } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createUserInput: CreateUserInput,
    transaction?: EntityManager,
  ): Promise<User> {
    const userRepository = transaction
      ? await getRepositoryFromTransaction(transaction, User)
      : this.userRepository;

    const userEntity = userRepository.create({
      ...createUserInput,
      role: Role.USER,
    });

    const savedUser = await userRepository.save(userEntity);

    return savedUser;
  }

  async readAll(findUserInput: FindUserInput): Promise<User[]> {
    const users = await this.userRepository.find({
      where: {
        ...findUserInput,
      },
    });

    return users;
  }

  async readById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['tokens'],
    });

    return user;
  }

  async readByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['tokens'],
    });

    return user;
  }
}
