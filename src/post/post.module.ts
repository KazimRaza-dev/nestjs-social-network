import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialPost, PostSchema } from './schema/post.schema';
import { JwtModule } from '@nestjs/jwt';
import { registerJWT } from 'src/auth/utils/registerJwt';
import { EventsModule } from 'src/events/events.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SocialPost.name, schema: PostSchema }]),
    JwtModule.register(registerJWT),
    EventsModule
  ],
  controllers: [PostController],
  providers: [PostService, JwtStrategy],
  exports: [MongooseModule]
})

export class PostModule { }
