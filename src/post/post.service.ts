import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { ResponseMessage } from './dto/response.dto';
import { UpdatePostDto } from "./dto/update-post.dto";
import { SocialPost, PostDocument } from './schema/post.schema';

@Injectable()
export class PostService {

  constructor(@InjectModel(SocialPost.name) private postModel: Model<PostDocument>) { }

  async create(createPostDto: CreatePostDto, userId: string): Promise<SocialPost> {
    createPostDto.userId = userId;
    const post = new this.postModel(createPostDto);
    return post.save();
  }

  async findAll(userId: string): Promise<SocialPost[] | ResponseMessage> {
    const posts = await this.postModel.find({ userId: userId });
    if (posts.length > 0) {
      return posts;
    }
    return {
      message: "No post exists for this user"
    }
  }

  async findOne(postId: string): Promise<SocialPost | ResponseMessage> {
    const post = await this.postModel.findById(postId)
    if (post) return post;
    return {
      message: `Post with id ${postId} does not exists.`
    }
  }

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

  async remove(userId: string, userRole: string, postId: string): Promise<ResponseMessage> {
    const canDelete = await this.checkUserAcces(userId, userRole, postId);
    if (!canDelete) {
      return { message: "You can't delete other user post." }
    }

    const post = await this.postModel.findByIdAndDelete(postId);
    if (post) return { message: "Post deleted!" };
    return { message: `Post with id ${postId} does not exists.` }
  }

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

  async checkPostExists(postId: string): Promise<SocialPost> {
    return this.postModel.findById(postId);
  }

  async isAlreadyLiked(postId: string, userId: string): Promise<SocialPost> {
    return this.postModel.findOneAndUpdate(
      { _id: postId, "likes": { $in: [userId] } },
      { $pull: { likes: userId } }, { new: true }
    )
  }

  async isAlreadyDisliked(postId: string, userId: string): Promise<SocialPost> {
    return this.postModel.findOneAndUpdate(
      { _id: postId, "dislikes": { $in: [userId] } },
      { $pull: { dislikes: userId } }, { new: true }
    )
  }

}
