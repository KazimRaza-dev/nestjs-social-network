import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { FeedModule } from './feed/feed.module';
import { PaymentModule } from './payment/payment.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: ['.development.env'],   //environment variables file for development
      envFilePath: ['.production.env'],       //environment variables file for production/deploy
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    PostModule,
    AuthModule,
    FeedModule,
    PaymentModule,
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
