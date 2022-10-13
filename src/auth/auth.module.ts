import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature(
    [{ name: User.name, schema: UserSchema }, ,]),
  JwtModule.register({
    secret: `${process.env.JWT_PRIVATE_KEY}`,
    signOptions: {
      expiresIn: "5h"
    },
  })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
