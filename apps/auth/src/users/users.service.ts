import { Injectable } from '@nestjs/common';
import { FindUserInput } from './dto';
import { User } from './entities';

@Injectable()
export class UsersService {
  userRepository: any;
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
}
