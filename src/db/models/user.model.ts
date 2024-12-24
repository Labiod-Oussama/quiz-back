import { Model, Table, Column, DataType } from 'sequelize-typescript';

export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id'> { }
 
@Table({ tableName: 'users', timestamps: true })
export class User extends Model<UserAttributes, UserCreationAttributes> {

    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: "بريد إلكتروني غير صالح"
            },
        }
    })
    email!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password!: string;
}