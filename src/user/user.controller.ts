import { Controller, Param, Patch } from '@nestjs/common';
import { ResponseMessage } from 'src/post/dto/response.dto';
import { ReqUser } from './dacorator/user.dacorator';
import { ReqUserDto } from './dto/req-user.dto';
import { UserService } from './user.service';
import { User } from './schema/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Patch('follow/:id')
  followUser(@ReqUser() user: ReqUserDto, @Param('id') followUserId: string): Promise<User> {
    return this.userService.followUser(user.id, followUserId);
  }

  @Patch('unfollow/:id')
  unfollowUser(@ReqUser() user: ReqUserDto, @Param('id') followingUserId: string): Promise<ResponseMessage> {
    return this.userService.unfollowUser(user.id, followingUserId);
  }


}
