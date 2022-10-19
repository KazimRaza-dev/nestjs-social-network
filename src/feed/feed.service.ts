import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentService } from 'src/payment/payment.service';
import { ResponseMessage } from 'src/post/dto/response.dto';
import { SocialPost, PostDocument } from 'src/post/schema/post.schema';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { FeedQuery } from './dto/query-feed.dto';

@Injectable()
export class FeedService {

  constructor(
    @InjectModel(SocialPost.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly paymentService: PaymentService
  ) { }

  /**
   * Show social feed to a user
   * 
   * @param userId Id of logged in user
   * @param queryParam Query string paramters object
   * @returns Social feed for a user
   */
  async showSocialFeed(userId: string, queryParam: FeedQuery): Promise<SocialPost[] | ResponseMessage> {
    const alreadyPaid = await this.paymentService.isAlreadyPaid(userId);
    if (!alreadyPaid) {
      return { message: "Social feed is restricted to paid users only. Make payment first." }
    }
    const following: string[] = await this.getFollowing(userId);
    const queryParamters = this.assignDefaultValues(queryParam);
    const feed = await this.getFeed(following, queryParamters);
    if (feed.length === 0) {
      return { message: "No more posts found. Follow more users to view their posts" }
    }
    return feed;
  }

  /**
   * Give all followings of a user
   * 
   * @param userId Id of user
   * @returns Users list a particular user is following
   */
  async getFollowing(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId);
    return user.following;
  }

  /**
   * This method assign default values to query string paramaters if user does not provide their values And also
   * convert page number and size to integer if user provides these paramters
   * 
   * @param queryParam Object of query string paramter  
   * @returns New query string paramter object
   */
  assignDefaultValues(queryParam: FeedQuery) {
    let { pageNo, size, sortBy, order } = queryParam;
    const pgNo = pageNo ? parseInt(pageNo) : 1;
    const pageSize = size ? parseInt(size) : 5;
    sortBy = sortBy ? sortBy : "createdAt";
    order = order ? order : "asc";
    return { pgNo, pageSize, sortBy, order }
  }

  /**
   * Return list of posts to a user after applying query string paramters
   * 
   * @param followingUsers List of users a user is following
   * @param queryParam Query string paramters
   * @returns List of posts to show in feed
   */
  async getFeed(followingUsers: string[], queryParam): Promise<SocialPost[]> {
    const sortOrder = queryParam.order === "asc" ? 1 : -1;
    const skip: number = (queryParam.pgNo - 1) * queryParam.pageSize;
    return this.postModel.find({ "userId": { "$in": followingUsers } })
      .sort({ [queryParam.sortBy]: sortOrder }).skip(skip).limit(queryParam.pageSize);
  }

}
