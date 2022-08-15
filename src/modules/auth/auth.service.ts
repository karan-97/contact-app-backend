import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { message } from 'src/common/assets/messages';
import { generateUniqueId } from 'src/common/utils/utils';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private mailService: MailService,
    ) { }

    async validateUser(username: string, pass: string) {
        // find if user exist with this email
        const user = await this.userService.findOneByEmail(username);
        if (!user) {
            return null;
        }

        // find if user password match
        const match = await this.comparePassword(pass, user.password);
        if (!match) {
            return null;
        }

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = user['dataValues'];
        return result;
    }

    public async login(user) {
        const token = await this.generateToken(user);
        return { user, token };
    }

    public async create(user) {
        const pass = await this.hashPassword(user.password);
        
        const code = generateUniqueId(6);

        const newUser = await this.userService.create({ ...user, password: pass, verification_code: code});

        const { password, ...result } = newUser['dataValues'];

        await this.mailService.sendUserConfirmation(newUser, code);

        const token = await this.generateToken(result);

        return { user: result, token };
    }

    private async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    private async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }


    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }

    public async verifyEmail(params) {
        const user = await this.userService.findOneById(params.id);
        if (!user) {
            throw new BadRequestException(message.auth.USER_NOT_FOUND)
        }
        if (user.is_verified === true) {
            return { message: message.auth.EMAIL_ALREADY_VERIFIED };
        }

        await this.userService.update({
            is_verified: true,
            email_verified_at: new Date(),
            verification_code: ''
        },
            params.id
        );

        return {
            message: message.auth.EMAIL_VERIFIED,
        }
    }
}