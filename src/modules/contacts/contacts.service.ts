import { Injectable, Inject } from '@nestjs/common';
import { Contact } from './contact.entity';
import { ContactDto } from './dto/contact.dto';
import { User } from '../users/user.entity';
import { CONTACT_REPOSITORY } from '../../common/constants';

@Injectable()
export class ContactsService {

    constructor(
        @Inject(CONTACT_REPOSITORY) private readonly contactRepository: typeof Contact
    ) { }

    async create(contact: ContactDto, userId: number): Promise<Contact> {
        return await this.contactRepository.create<Contact>({ ...contact, user_id: userId });
    }

    async findAll(userId: number,page: number, limit: number): Promise<{rows: Contact[], count: number}> {
        return await this.contactRepository.findAndCountAll({
            where:{user_id: userId},
            limit: limit,
            offset: (page)* limit,
            include: [{ model: User, attributes: { exclude: ['password'] } }],
        });
    }

    async findOne(id: number): Promise<Contact> {
        return await this.contactRepository.findOne({
            where: { id },
            include: [{ model: User, attributes: { exclude: ['password'] } }],
        });
    }

    async delete(id: number, userId: number) {
        return await this.contactRepository.destroy({ where: { id: id, user_id: userId } });
    }

    async update(id: number, data: any, userId: number) {
        const [numberOfAffectedRows, [updatedContact]] = await this.contactRepository.update({ ...data }, { where: { id, user_id: userId }, returning: true });
        return { numberOfAffectedRows, updatedContact };
    }

}
