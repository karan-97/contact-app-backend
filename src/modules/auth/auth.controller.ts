import { Controller, Body, Post, UseGuards, Request, Get, Render, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/user.dto';
import { SuccessMessage } from 'src/common/decorators/success-message-decorator';
import { message } from 'src/common/assets/messages';
import { UserExist } from 'src/core/guards/userExist.guard';
import { Response } from 'express';
import { errorResponse, successResponse } from 'src/common/utils/utils';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('verify-email/:id/:code')
    async verifyEmail(@Request() req: any, @Res() res: Response) {
        try {
            const verificationResponse = await this.authService.verifyEmail(req.params);
            return successResponse(
                res,
                HttpStatus.OK,
                message.SUCCESS_RESPONSE,
                verificationResponse,
            );
        } catch (error) {
            return errorResponse(
                res,
                HttpStatus.INTERNAL_SERVER_ERROR,
                message.ERROR_REPONSE,
            )
        }
    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req, @Res() res: Response) {
        try {
            const login = await this.authService.login(req.user);
            return successResponse(
                res,
                HttpStatus.OK,
                message.SUCCESS_RESPONSE,
                login,
            );
        } catch (error) {
            return errorResponse(
                res,
                HttpStatus.INTERNAL_SERVER_ERROR,
                message.ERROR_REPONSE,
            )
        }
    }

    @UseGuards(UserExist)
    @Post('signup')
    @SuccessMessage(message.auth.RIGISTRATION_SUCCESS)
    async signUp(@Body() user: CreateUserDto, @Res() res: Response) {
        try{
            const register = await this.authService.create(user);
            return successResponse(
                res,
                HttpStatus.OK,
                message.SUCCESS_RESPONSE,
                register
            )
        }catch(error){
            return errorResponse(
                res,
                HttpStatus.INTERNAL_SERVER_ERROR,
                message.ERROR_REPONSE,
            )
        }
       
    }
}