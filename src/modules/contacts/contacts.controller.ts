import { Response } from 'express';
import { Controller, Get, Post, Put, Param, Body, NotFoundException, UseGuards, Request, Query, Req, HttpStatus, Res, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContactsService } from './contacts.service';
import { ContactDto } from './dto/contact.dto';
import { errorResponse, sendPaginatedReponse, successResponse } from 'src/common/utils/utils';
import { message } from 'src/common/assets/messages';

@Controller('contacts')
export class ContactsController {

    constructor(private readonly contactService: ContactsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll(
        @Req() req: any,
        @Res() res: Response,
        @Query('limit') limit?: number,
        @Query('page') page?: number,
    ) {
        try {
            const userContacts = await this.contactService.findAll(+req.user.id,+page, +limit);
            const total_records = userContacts.count;
            const paginatedResponse = sendPaginatedReponse(userContacts.rows, total_records, +page, +limit);
            return successResponse(
                res,
                HttpStatus.OK,
                message.SUCCESS_RESPONSE,
                paginatedResponse.data,
                paginatedResponse.meta,
            );
        } catch (error) {
            return errorResponse(
                res,
                HttpStatus.INTERNAL_SERVER_ERROR,
                message.ERROR_REPONSE,
            )
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOne(@Param('id') id: number, @Res() res: Response): Promise<any> {

        try {
            const contact = await this.contactService.findOne(id);

            if (!contact) {
                throw new NotFoundException('This contact doesn\'t exist');
            }

            return successResponse(
                res,
                HttpStatus.OK,
                message.SUCCESS_RESPONSE,
                contact,
            );
        } catch (error) {
            return errorResponse(
                res,
                HttpStatus.INTERNAL_SERVER_ERROR,
                message.ERROR_REPONSE,
            )
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() contact: ContactDto, @Request() req, @Res() res: Response): Promise<any> {
        try {
            const newContact = await this.contactService.create(contact, req.user.id);
            return successResponse(
                res,
                HttpStatus.CREATED,
                message.contact.CONTACT_CREATED_SUCCESS,
                newContact,
            );
        } catch (error) {
            return errorResponse(
                res,
                HttpStatus.INTERNAL_SERVER_ERROR,
                message.ERROR_REPONSE,
            )
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: number, @Body() contact: ContactDto, @Request() req, @Res() res: Response): Promise<any> {
        try {
            const { numberOfAffectedRows, updatedContact } = await this.contactService.update(id, contact, req.user.id);

            if (numberOfAffectedRows === 0) {
                throw new NotFoundException('This Post doesn\'t exist');
            }

            return successResponse(
                res,
                HttpStatus.OK,
                message.contact.CONTACT_UPDATED_SUCCESS,
                updatedContact,
            );
        } catch (error) {
            return errorResponse(
                res,
                HttpStatus.INTERNAL_SERVER_ERROR,
                message.ERROR_REPONSE,
            )
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async destory(@Param('id') id: number, @Req() req: any, @Res() res: any): Promise<any> {
        try {
            const contact = await this.contactService.delete(id, req.user.id);

            return successResponse(
                res,
                HttpStatus.OK,
                message.contact.CONTACT_REMOVED_SUCCESS,
                contact,
            );
        } catch (error) {
            return errorResponse(
                res,
                HttpStatus.INTERNAL_SERVER_ERROR,
                message.ERROR_REPONSE,
            )
        }
    }

}
