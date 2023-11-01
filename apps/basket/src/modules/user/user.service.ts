import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async readById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    return user;
  }

  async create(id: number): Promise<User> {
    if (await this.doesUserExist(id)) {
      throw new RpcException('Specified user already exists');
    }

    const userEntity = this.userRepository.create({ id });
    const createdUser = await this.userRepository.save(userEntity);

    return createdUser;
  }

  async createOrGet(id: number): Promise<User> {
    const user = (await this.doesUserExist(id))
      ? await this.readById(id)
      : await this.create(id);

    return user;
  }

  private async doesUserExist(id: number): Promise<Boolean> {
    const doesProductExist = await this.userRepository.exist({ where: { id } });

    return doesProductExist;
  }
}
