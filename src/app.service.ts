import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  startApp(): string {
    return 'Social Network project using NestJS!';
  }
}
