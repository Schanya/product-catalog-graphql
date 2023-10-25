import { Injectable } from '@nestjs/common';
import { CreateUserInput, FindUserInput } from './dto';
import { User } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@libs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const userEntity = this.userRepository.create({
      ...createUserInput,
      role: Role.USER,
    });

    const savedUser = await this.userRepository.save(userEntity);

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
