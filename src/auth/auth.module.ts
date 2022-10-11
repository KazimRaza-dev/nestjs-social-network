import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { registerJWT } from './utils/registerJwt';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports:
    [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, ,]),
    JwtModule.register(registerJWT),
    forwardRef(() => EventsModule),
    ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
