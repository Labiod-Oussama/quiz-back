import { Model, Table, Column, DataType, PrimaryKey, AutoIncrement, ForeignKey, AllowNull, BelongsTo } from 'sequelize-typescript';
import { Patient } from './patient.model';
import { toJson } from '../../utils/to_json';

export interface TestsAttributes {
    id: number;
    answers: object;
    result: number;
    patientId: number;
}

@Table({ tableName: 'tests', timestamps: true })
export class Test extends Model<TestsAttributes, Omit<TestsAttributes, 'id'>> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column({
        type: DataType.JSON,
        allowNull: false,
        get() {
            const rawValue: unknown = this.getDataValue("answers");
            return toJson(rawValue);
        }
    })
    answers!: object;

    @Column({ type: DataType.INTEGER, allowNull: false })
    result!: number;

    @BelongsTo(() => Patient, { foreignKey: "patientId" })
    patient!: Patient;
}     