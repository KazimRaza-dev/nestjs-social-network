import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { JwtAuthMiddleware } from 'src/auth/middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { registerJWT } from 'src/auth/utils/registerJwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register(registerJWT)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes('user');
  }
}
