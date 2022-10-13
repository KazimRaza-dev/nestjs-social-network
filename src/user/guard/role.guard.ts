import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const role: string = user.role;
        if (role !== "user") {
            throw new ForbiddenException('This endpoint is restricted to USERS only.')
        }
        return true;
    }
}
