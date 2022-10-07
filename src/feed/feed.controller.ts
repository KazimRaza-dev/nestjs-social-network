import { Controller, Get, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { ReqUser } from 'src/user/dacorator/user.dacorator';
import { ReqUserDto } from 'src/user/dto/req-user.dto';
import { FeedQuery } from './dto/query-feed.dto';
import { JoiValidationPipe } from 'src/auth/pipes/validation.pipe';
import { feedSchema } from './joi-schema/feedQuery.schema';
import { Post } from 'src/post/schema/post.schema';
import { ResponseMessage } from 'src/post/dto/response.dto';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) { }

  @Get()
  showFeed(
    @ReqUser() user: ReqUserDto,
    @Query(new JoiValidationPipe(feedSchema)) query: FeedQuery
  ): Promise<Post[] | ResponseMessage> {
    return this.feedService.showSocialFeed(user.id, query);
  }

}
