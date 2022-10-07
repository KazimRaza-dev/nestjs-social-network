import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseMessage } from 'src/post/dto/response.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async followUser(userId: string, followUserId: string): Promise<User> {
    if (userId === followUserId) {
      throw new BadRequestException("You can't follow yourself")
    }
    const isUserExist = await this.checkUserExists(followUserId);
    if (!isUserExist) {
      throw new NotFoundException(`User with id ${followUserId} does not exists`)
    }
    const isfollowing = await this.isAlreadyFollowing(userId, followUserId);
    if (isfollowing) {
      throw new BadRequestException("You are already following this user")
    }

    return this.userModel.findByIdAndUpdate(userId, {
      $push: { following: followUserId }
    }, { new: true });
  }

  async unfollowUser(userId: string, followingUserId: string): Promise<ResponseMessage> {
    if (userId === followingUserId) {
      throw new BadRequestException("You can't unfollow yourself")
    }
    const isUserExist = await this.checkUserExists(followingUserId);
    if (!isUserExist) {
      throw new NotFoundException(`User with id ${followingUserId} does not exists`)
    }
    const isfollowing = await this.isAlreadyFollowing(userId, followingUserId);
    if (!isfollowing) {
      throw new BadRequestException("You are NOT following this user.")
    }

    await this.userModel.findByIdAndUpdate(userId, {
      $pullAll: { following: [followingUserId], },
    }, { new: true });
    return {
      message: "You have successfully unfollowed this user."
    }

  }
  async checkUserExists(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (user) return true;
    return false;
  }

  async isAlreadyFollowing(userId: string, followUserId: string) {
    return this.userModel.findOne()
      .and([{ _id: userId }, { "following": followUserId }]);
  }
}
