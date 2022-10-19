import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { ReqUser } from 'src/user/dacorator/user.dacorator';
import { ReqUserDto } from 'src/user/dto/req-user.dto';
import { FeedQuery } from './dto/query-feed.dto';
import { SocialPost } from 'src/post/schema/post.schema';
import { ResponseMessage } from 'src/post/dto/response.dto';
import { RolesGuard } from 'src/user/guard/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('feed')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(private readonly feedService: FeedService) { }

  @Get()
  showFeed(
    @ReqUser() user: ReqUserDto,
    @Query() query: FeedQuery
  ): Promise<SocialPost[] | ResponseMessage> {
    return this.feedService.showSocialFeed(user.id, query);
  }

}
