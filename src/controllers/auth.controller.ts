import 'dotenv/config';
import { RequestHandler } from 'express';
import { User } from '../db/models/user.model';
import bcrypt from 'bcrypt';
import { Role, TokenService } from '../services/token.service';

export const signUp: RequestHandler = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        res.status(400).send('Name, email, and password are required');
        return;
    }

    try {
        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).send('بريد الكتروني مستعمل');
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const tokenService = new TokenService(process.env.TOKEN_SECRET || 'quiz123');

        const token = tokenService.generateToken({
            id: newUser.id,
            email: newUser.email,
            role: Role.ADMIN
        });

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            accessToken: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while creating the user');
    }
};


export const signIn: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    // Validate input  
    if (!email || !password) {
        res.status(400).send('Email and password are required');
        return;
    }

    try {
        // Check if a user with the given email exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(404).send('البريد الالكتروني غير مسجل');
            return;
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(401).send('كلمة المرور غير صحيحة');
            return;
        }

        const tokenService = new TokenService(process.env.TOKEN_SECRET || 'quiz123');

        const token = tokenService.generateToken({
            id: user.id,
            email: user.email,
            role: Role.ADMIN
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while signing in');
    }
};

