import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  startApp(): string {
    console.log(process.env.NODE_ENV);
    console.log(`.${process.env.NODE_ENV}.env`);

    return 'Social Network project using NestJS!';
  }
}
