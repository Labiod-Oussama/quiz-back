
import { Request } from 'express';
import jwt from 'jsonwebtoken';
export enum Role {
    ADMIN = 'admin',
    USER = 'user'
}

export interface TokenPayload {
    id: number;
    email: string;
    role?: Role;
}

export class TokenService {
    private secretKey: string;
    private expiresIn: string;

    constructor(secretKey: string, expiresIn: string = '1h') {
        this.secretKey = secretKey;
        this.expiresIn = expiresIn;
    }

    static extractTokenFromHeader(request: Request): string | null {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) {
            return null;
        }
        const [type, token] = authorizationHeader.split(' ');
        if (type !== 'Bearer') {
            return null;
        }
        return token;
    }

    public generateToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
    }

    public verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, this.secretKey) as TokenPayload;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    public decodeToken(token: string): TokenPayload | null {
        const decoded = jwt.decode(token);
        return decoded as TokenPayload | null;
    }
}