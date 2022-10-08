import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ResponseMessage } from 'src/post/dto/response.dto';
import { ReqUser } from './dacorator/user.dacorator';
import { ReqUserDto } from './dto/req-user.dto';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { RolesGuard } from './guard/role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Patch('follow/:id')
  @UseGuards(RolesGuard)
  followUser(@ReqUser() user: ReqUserDto, @Param('id') followUserId: string): Promise<User> {
    return this.userService.followUser(user.id, followUserId);
  }

  @Patch('unfollow/:id')
  @UseGuards(RolesGuard)
  unfollowUser(@ReqUser() user: ReqUserDto, @Param('id') followingUserId: string): Promise<ResponseMessage> {
    return this.userService.unfollowUser(user.id, followingUserId);
  }


}
