import { Model, Table, Column, DataType, PrimaryKey, AutoIncrement, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

export interface PatientAttributes {
    id: number | string;
    firstName: string;
    lastName: string;
    educationLevel: string;
    doctorId: number | string;
}

@Table({ tableName: 'patients', timestamps: true })
export class Patient extends Model<PatientAttributes, Omit<PatientAttributes, 'id'>> {

    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER })
    id!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    firstName!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    lastName!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    educationLevel?: string;

    @BelongsTo(() => User, { foreignKey: "doctorId" })
    user!: User;

    // @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
    // examDate?: Date;
}
