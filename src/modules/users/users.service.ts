import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../common/constants';

@Injectable()
export class UsersService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User) { }

    async create(user: CreateUserDto): Promise<User> {
        return await this.userRepository.create<User>(user);
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { email } });
    }

    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { id } });
    }

    async update(data: any, userId: number) {
        const [numberOfAffectedRows, [updatdUser]] = await this.userRepository.update({ ...data }, { where: { id: userId }, returning: true });
        return { numberOfAffectedRows, updatdUser };
    }
}