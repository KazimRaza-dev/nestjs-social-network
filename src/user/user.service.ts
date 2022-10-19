import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventsGateway } from 'src/events/events.gateway';
import { ResponseMessage } from 'src/post/dto/response.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => EventsGateway)) private eventGateway: EventsGateway
  ) { }

  /**
   * Follow a new user
   * 
   * @param userId Id to logged in user
   * @param followUserId Id of user to follow
   * @returns User with updated following list else error message 
   */
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

  /**
   * Unfollow already following user
   * 
   * @param userId Id of logged in user
   * @param followingUserId Id of user to unfollow
   * @returns User with updated following list else erorr message
   */
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

  /**
   * Check whether a user exists or not  
   * 
   * @param userId Id of user to check
   * @returns User object if it exists
   */
  async checkUserExists(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (user) return true;
    return false;
  }

  /**
   * Check whether the logged In user is already following the other user or not
   * 
   * @param userId Id of user who wants to follow other user
   * @param followUserId Id of user to be followed
   * @returns user object if it exists
   */
  async isAlreadyFollowing(userId: string, followUserId: string) {
    return this.userModel.findOne()
      .and([{ _id: userId }, { "following": followUserId }]);
  }

  /**
   * Give a list of all the users a user is following
   * 
   * @param userId Id of logged In user
   * @returns list of user Ids a user is following
   */
  async getFollowedUsers(userId: string) {
    const isUserExist = await this.checkUserExists(userId);
    if (!isUserExist) {
      return false;
    }
    const user = await this.userModel.findById(userId);
    return user.following;
  }
}
