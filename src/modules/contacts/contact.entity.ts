import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.entity';

@Table
export class Contact extends Model<Contact> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    full_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    email: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id: number;

    
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    phone_number: string;

    @BelongsTo(() => User)
    user: User;

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