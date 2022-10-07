import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {

    constructor(private jwtService: JwtService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers['x-auth-token'] as string;
            const decodedToken = await this.jwtService.verifyAsync(token);
            if (!decodedToken) {
                throw new UnauthorizedException();
            }
            req.user = decodedToken;
            next();
        } catch (error) {
            throw new UnauthorizedException(error.message)
        }
    }
}
