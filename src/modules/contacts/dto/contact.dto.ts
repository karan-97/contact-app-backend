import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { message } from "src/common/assets/messages";

export class ContactDto {
    @IsNotEmpty()
    @IsString()
    full_name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^([+]\d{2})?\d{10}$/, {
        message: message.contact.INVALID_NUMBER,
    })
    phone_number: string;

}