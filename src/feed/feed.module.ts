import { MiddlewareConsumer, Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { JwtModule } from '@nestjs/jwt';
import { registerJWT } from 'src/auth/utils/registerJwt';
import { JwtAuthMiddleware } from 'src/auth/middleware/auth.middleware';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.register(registerJWT),
    PostModule, UserModule
  ],
  controllers: [FeedController],
  providers: [FeedService]
})
export class FeedModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes('feed');
  }
}
