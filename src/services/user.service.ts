import { Patient, PatientAttributes } from "../db/models/patient.model";

export class UserService {
    private userId: number | string;

    constructor(userId: number | string) {
        this.userId = userId;
    }

    getAllPatients = async () => {
        const patients = await Patient.findAll({
            where: {
                doctorId: this.userId
            }
        });
        return patients;
    }

    addPatient = async (patient: Omit<PatientAttributes, 'id' | 'doctorId'>) => {
        const newPatient = await Patient.create({
            ...patient,
            doctorId: this.userId
        });
        return newPatient;
    }
}