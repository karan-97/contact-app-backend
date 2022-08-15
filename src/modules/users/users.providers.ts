import { User } from './user.entity';
import { USER_REPOSITORY } from '../../common/constants';

export const usersProviders = [{
    provide: USER_REPOSITORY,
    useValue: User,
}];