import { CanActivate, ExecutionContext, Injectable, ConflictException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { message } from 'src/common/assets/messages';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class UserExist implements CanActivate {
    constructor(private readonly userService: UsersService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const userExist = await this.userService.findOneByEmail(request.body.email);
        if (userExist) {
            throw new ConflictException(message.auth.EMAIL_ALREADY_EXISTS);
        }
        return true;
    }
}