import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:
    [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: "qwertyuiopasdfghjklzxcvbnm",
      signOptions: { expiresIn: '5h' },
    }),
      PassportModule
    ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule { }
