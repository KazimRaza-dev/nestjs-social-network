import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialPost, PostSchema } from './schema/post.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthMiddleware } from 'src/auth/middleware/auth.middleware';
import { registerJWT } from 'src/auth/utils/registerJwt';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SocialPost.name, schema: PostSchema }]),
    JwtModule.register(registerJWT),
    EventsModule
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [MongooseModule]
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes('post');
  }
}
