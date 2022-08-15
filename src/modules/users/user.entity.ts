import { type } from 'os';
import { Timestamp } from 'rxjs';
import { Table, Column, Model, DataType, AllowNull, Unique } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    full_name: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    is_verified: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    verification_code: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        unique: true
    })
    email_verified_at: Date;

    @Column({
        type: DataType.DATE,
        defaultValue: Date.now()
    })
    createdAt: Date;

    @Column({
        type: DataType.DATE,
        defaultValue: Date.now()

    })
    updatedAt: Date;
}