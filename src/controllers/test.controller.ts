import 'dotenv/config';
import { Request, RequestHandler, Response } from 'express';
import { Test, TestsAttributes } from '../db/models/test.model';
import { TokenPayload } from '../services/token.service';
import { Patient } from '../db/models/patient.model';
import { User } from '../db/models/user.model';


export const getAllTests = async (req: Request, res: Response): Promise<any> => {
    const payload = res.locals as TokenPayload;

    try {
        // Fetch all tests with associated patient and user (doctor)
        const tests = await Test.findAll({
            include: [
                {
                    model: Patient,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email'], // Fetch only necessary fields
                        },
                    ],
                },
            ],
        });

        if (!tests.length) {
            return res.status(404).send('No tests found.');
        }

        // Filter tests belonging to the authenticated doctor
        const doctorTests = tests.filter(test => test.patient?.user?.id === payload.id);

        if (!doctorTests.length) {
            return res.status(404).send('No tests found for the logged-in doctor.');
        }

        // Format response
        const formattedTests = doctorTests.map(test => ({
            id: test.id,
            answers: test.answers,
            result: test.result,
            examDate: test.createdAt,
            patient: {
                id: test.patient.id,
                firstName: test.patient.firstName,
                lastName: test.patient.lastName,
                educationLevel: test.patient.educationLevel,
                doctor: {
                    id: test.patient.user.id,
                    name: test.patient.user.name,
                },
            },
        }));

        return res.status(200).json(formattedTests);
    } catch (error) {
        console.error('Error fetching tests:', error);
        return res.status(500).send('An error occurred while fetching the tests.');
    }
};


export const getOneTest: RequestHandler = async (req, res) => {
    const testId = req.params.id;
    try {
        const test = await Test.findByPk(testId, {
            include: [
                {
                    model: Patient,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email'], // Fetch only necessary fields
                        },
                    ],
                },
            ],
        });

        if (!test) {
            res.status(404).send('Test not found.');
            return;
        }

        // Format response
        const formattedTest = {
            id: test.id,
            answers: test.answers,
            result: test.result,
            examDate: test.createdAt,
            patient: {
                id: test.patient.id,
                firstName: test.patient.firstName,
                lastName: test.patient.lastName,
                educationLevel: test.patient.educationLevel,
                doctor: {
                    id: test.patient.user.id,
                    name: test.patient.user.name,
                },
            },
        };

        res.status(200).json(formattedTest);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the test');
    }
}


export const saveTest: RequestHandler = async (req, res) => {
    const patientId = req.params.id;
    const { answers, result } = req.body as Omit<TestsAttributes, 'id' | 'patientId'>;
    try {
        if (!patientId) {
            res.status(400).send('Patient ID is required');
            return;
        }
        const newTest = await Test.create({
            patientId: parseInt(patientId),
            result,
            answers
        });
        res.status(201).json(newTest);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while saving the test');
    }
}


export const deleteTest: RequestHandler = async (req, res) => {
    const testId = req.params.id;
    try {
        const test = await Test.findByPk(testId);

        if (!test) {
            res.status(404).send('الامتحان غير موجود');
            return;
        }

        await test.destroy();
        res.status(200).send('Test deleted successfully.');
    } catch (error) {
        console.error('Error deleting test:', error);
        res.status(500).send('An error occurred while deleting the test.');
    }
};