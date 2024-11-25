import { RequestHandler } from "express";
import { User } from "../db/models/user.model";
import { TokenService } from "../services/token.service";

export type AuthMiddleware<
    Locals extends Record<keyof User, User[keyof User]> = Record<
        keyof User,
        User[keyof User]
    >
> = RequestHandler<Record<string, string>, any, any, any, Locals>;

export const authMiddleware: AuthMiddleware = (req, res, next) => {
    // Check if the user is authenticated
    const token = TokenService.extractTokenFromHeader(req);
    if (!token) {
        res.status(401).json({ status: 401, error: "Unauthorized" });
        return;
    }

    // Verify the token

    const tokenService = new TokenService(process.env.TOKEN_SECRET || 'quiz123');
    try {
        const payload = tokenService.verifyToken(token);
        // Attach the user to the request object
        res.locals = payload as any;
    } catch (error) {
        res.status(401).json({ status: 401, error: "Unauthorized" });
        return;
    }



    next();
};