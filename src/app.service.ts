import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  startApp(): string {
    return 'Social network project using NestJS!';
  }
}
