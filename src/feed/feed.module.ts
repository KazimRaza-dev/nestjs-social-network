import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { JwtModule } from '@nestjs/jwt';
import { registerJWT } from 'src/auth/utils/registerJwt';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [
    JwtModule.register(registerJWT),
    PostModule, UserModule, PaymentModule
  ],
  controllers: [FeedController],
  providers: [FeedService]
})
export class FeedModule { }
