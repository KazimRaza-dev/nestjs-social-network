import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventsGateway } from 'src/events/events.gateway';
import { CreatePostDto } from './dto/create-post.dto';
import { ResponseMessage } from './dto/response.dto';
import { UpdatePostDto } from "./dto/update-post.dto";
import { SocialPost, PostDocument } from './schema/post.schema';

@Injectable()
export class PostService {

  constructor(@InjectModel(SocialPost.name) private postModel: Model<PostDocument>,
    private readonly eventGateway: EventsGateway
  ) { }

  /**
   * Create a new post
   * 
   * @param createPostDto Post data to be added
   * @param userId Id of logged In user
   * @returns Succuess message after adding the post to database
   */
  async create(createPostDto: CreatePostDto, userId: string): Promise<SocialPost> {
    createPostDto.userId = userId;
    const post = new this.postModel(createPostDto);
    if (post) {
      this.eventGateway.sendPostToRoom(userId, post)
    }
    return post.save();
  }

  /**
   * Give posts of a user after paginating the records
   * 
   * @param userId Id of logged in user
   * @param pageNo Page number for pagination
   * @param size Number of records per page
   * @returns list of all posts of user
   */
  async findAll(userId: string, pageNo: string, size: string): Promise<SocialPost[] | ResponseMessage> {
    const pgNo = pageNo && parseInt(pageNo);
    const pageSize = size && parseInt(size);
    const skip: number = (pgNo - 1) * pageSize;

    const posts = await this.postModel.find({ userId: userId })
      .skip(skip).limit(pageSize);
    if (posts.length > 0) {
      return posts;
    }
    return {
      message: "No more post exists for this user"
    }
  }

  /**
   * Get single post by passing its Id
   * 
   * @param postId Id of post that user wants to get
   * @returns Post if it exists else failure message
   */
  async findOne(postId: string): Promise<SocialPost | ResponseMessage> {
    const post = await this.postModel.findById(postId)
    if (post) return post;
    return {
      message: `Post with id ${postId} does not exists.`
    }
  }

  /**
   * Update already existing post
   * 
   * @param userId Id of logged in user
   * @param userRole Role of current user, either user or moderator
   * @param postId Id of the post to be updated
   * @param updatePostDto Fields to be updated
   * @returns Updated post if the post is updated else failure message
   */
  async update(userId: string, userRole: string, postId: string, updatePostDto: UpdatePostDto): Promise<SocialPost | ResponseMessage> {
    const canEdit = await this.checkUserAcces(userId, userRole, postId);
    if (!canEdit) {
      return { message: "You can't edit other user post." }
    }

    const post = await this.postModel.findByIdAndUpdate(postId, updatePostDto, {
      new: true
    });
    if (post) return post;
    return { message: `Post with id ${postId} does not exists.` }
  }

  /**
   * Delete already existing post
   * 
   * @param userId Id of logged in user
   * @param userRole Role of current user, either user or moderator
   * @param postId Id of post to be deleted
   * @returns Succuess message if the post is deleted else failure message
   */
  async remove(userId: string, userRole: string, postId: string): Promise<ResponseMessage> {
    const canDelete = await this.checkUserAcces(userId, userRole, postId);
    if (!canDelete) {
      return { message: "You can't delete other user post." }
    }

    const post = await this.postModel.findByIdAndDelete(postId);
    if (post) return { message: "Post deleted!" };
    return { message: `Post with id ${postId} does not exists.` }
  }

  /**
   * Check if the user is owner of this post or Not
   * @param userId Id of logged in user
   * @param userRole Role of user
   * @param postId Id of post
   * @returns True if the user is owner of the post else false
   */
  async checkUserAcces(userId: string, userRole: string, postId: string): Promise<boolean> {
    if (userRole === "moderator") {
      return true;
    }
    const post = await this.postModel.findOne({ _id: postId, userId: userId });
    if (post) {
      return true;
    }
    return false;
  }

  /**
   * Like any existing post
   * 
   * @param userId Id of logged in user
   * @param postId Id of post to be liked
   * @returns Post with updated likes list else error message
   */
  async likePost(userId: string, postId: string): Promise<SocialPost | ResponseMessage> {
    const isPostExists = await this.checkPostExists(postId);
    if (!isPostExists) {
      throw new NotFoundException(`Post with id ${postId} does not exists`);
    }
    const alreadyLiked = await this.isAlreadyLiked(postId, userId);
    if (alreadyLiked) {
      return { message: "Your like removed from this post." }
    }
    //if user has already dislike the post, remove the dislike first then like that post.
    await this.isAlreadyDisliked(postId, userId);
    return this.postModel.findByIdAndUpdate(postId, {
      $push: { likes: userId }
    }, { new: true });
  }

  /**
   * Dislike any existing post
   * 
   * @param userId Id of logged in user
   * @param postId Id of post to be disliked
   * @returns Post with updated dislikes list else error message
   */
  async dislikePost(userId: string, postId: string): Promise<SocialPost | ResponseMessage> {
    const isPostExists = await this.checkPostExists(postId);
    if (!isPostExists) {
      throw new NotFoundException(`Post with id ${postId} does not exists`);
    }
    const alreadyDisliked = await this.isAlreadyDisliked(postId, userId);
    if (alreadyDisliked) {
      return { message: "Your dislike removed from this post." }
    }
    //if user has already like the post, remove the like first then dislike that post.
    await this.isAlreadyLiked(postId, userId);
    return this.postModel.findByIdAndUpdate(postId, {
      $push: { dislikes: userId }
    }, { new: true });
  }

  /**
   * Check if specific post exists or not
   * 
   * @param postId Id of post 
   * @returns Post if it exists
   */
  async checkPostExists(postId: string): Promise<SocialPost> {
    return this.postModel.findById(postId);
  }

  /**
   * Check if a post is already liked by logged in user 
   * 
   * @param postId Id of post to check
   * @param userId Id of logged in user
   * @returns Post document if it's already liked
   */
  async isAlreadyLiked(postId: string, userId: string): Promise<SocialPost> {
    return this.postModel.findOneAndUpdate(
      { _id: postId, "likes": { $in: [userId] } },
      { $pull: { likes: userId } }, { new: true }
    )
  }

  /**
   * Check if a post is already disliked by logged in user 
   * 
   * @param postId Id of post to check
   * @param userId Id of logged in user
   * @returns Post document if it's already disliked
   */
  async isAlreadyDisliked(postId: string, userId: string): Promise<SocialPost> {
    return this.postModel.findOneAndUpdate(
      { _id: postId, "dislikes": { $in: [userId] } },
      { $pull: { dislikes: userId } }, { new: true }
    )
  }
}
