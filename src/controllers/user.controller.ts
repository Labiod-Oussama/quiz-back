import 'dotenv/config';
import { RequestHandler } from 'express';
import { User } from '../db/models/user.model';
import createHttpError from 'http-errors';
import { TokenPayload } from '../services/token.service';
import { UserService } from '../services/user.service';
import { Patient, PatientAttributes } from '../db/models/patient.model';

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

export const getPatient: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw createHttpError(400, "يجب إدخال رقم المريض");
        }
        const patient = await Patient.findByPk(id);
        if (!patient) {
            res.status(404).send("المريض غير موجود");
            return;
        }
        res.status(201).json(patient);
        return;
    } catch (error) {
        console.error(error);
        throw createHttpError(500, (error as Error).message);
    }
}

export const addPatient: RequestHandler = async (req, res) => {
    const { firstName, lastName, age, educationLevel } = req.body as PatientAttributes;
    try {
        const payload = res.locals as TokenPayload;
        const user = new UserService(payload.id);
        const newPatient = await user.addPatient({
            firstName,
            lastName,
            age,
            educationLevel,
        });
        res.status(201).json(newPatient);
        return;
    } catch (error) {
        console.error(error);
        throw createHttpError(500, (error as Error).message);
    }
}

export const updatePatient: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, age, educationLevel } = req.body as PatientAttributes;
    const payload = res.locals as TokenPayload;
    try {
        if (!id) {
            throw createHttpError(400, "يجب إدخال رقم المريض");
        }
        const patient = await Patient.findByPk(id);
        if (!patient) {
            res.status(404).send("المريض غير موجود");
            return;
        }
        const updatedPatient = await patient.update({
            firstName,
            lastName,
            age,
            educationLevel,
            doctorId: payload.id
        })
        res.status(200).json(updatedPatient);
        return;
    } catch (error) {
        console.error(error);
        throw createHttpError(500, (error as Error).message);
    }
}

export const deletePatient: RequestHandler = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            throw createHttpError(400, "يجب إدخال رقم المريض");
        }
        const patient = await Patient.findByPk(id);
        if (!patient) {
            res.status(404).send("المريض غير موجود");
            return;
        }
        await patient.destroy();
        res.status(204).send("تم حذف المريض بنجاح");
        return;
    } catch (error) {
        console.error(error);
        throw createHttpError(500, (error as Error).message);
    }
}