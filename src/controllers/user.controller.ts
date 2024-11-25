import 'dotenv/config';
import { RequestHandler } from 'express';
import { User } from '../db/models/user.model';
import createHttpError from 'http-errors';
import { TokenPayload } from '../services/token.service';
import { UserService } from '../services/user.service';
import { PatientAttributes } from '../db/models/patient.model';

export const getMyInfos: RequestHandler = async (req, res) => {
    try {
        const payload = res.locals as TokenPayload;
        const user = await User.findByPk(payload.id);
        if (!user) {
            res.status(404).send("مستخدم غير موجود");
            return;
        }
        res.status(201).json(user);
        return;
    } catch (error) {
        console.error(error);
        throw createHttpError(500, (error as Error).message);
    }
}

export const getPatients: RequestHandler = async (req, res) => {
    try {
        const payload = res.locals as TokenPayload;
        const user = new UserService(payload.id);
        const patients = await user.getAllPatients();
        res.status(201).json(patients);
        return;
    } catch (error) {
        console.error(error);
        throw createHttpError(500, (error as Error).message);
    }
}

export const addPatient: RequestHandler = async (req, res) => {
    const { firstName, lastName, educationLevel, doctorId } = req.body as PatientAttributes;
    try {
        const payload = res.locals as TokenPayload;
        const user = new UserService(payload.id);
        const newPatient = await user.addPatient({
            firstName,
            lastName,
            educationLevel,
            doctorId
        });
        res.status(201).json(newPatient);
        return;
    } catch (error) {
        console.error(error);
        throw createHttpError(500, (error as Error).message);
    }
}