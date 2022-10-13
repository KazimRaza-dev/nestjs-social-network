import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthMiddleware } from 'src/auth/middleware/auth.middleware';
import { registerJWT } from 'src/auth/utils/registerJwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    JwtModule.register(registerJWT)
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
