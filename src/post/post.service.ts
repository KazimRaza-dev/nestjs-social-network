import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { ResponseMessage } from './dto/response.dto';
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post, PostDocument } from './schema/post.schema';

@Injectable()
export class PostService {

  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) { }

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    createPostDto.userId = userId;
    const post = new this.postModel(createPostDto);
    return post.save();
  }

  async findAll(userId: string): Promise<Post[] | ResponseMessage> {
    const posts = await this.postModel.find({ userId: userId });
    if (posts.length > 0) {
      return posts;
    }
    return {
      message: "No post exists for this user"
    }
  }

  async findOne(postId: string): Promise<Post | ResponseMessage> {
    const post = await this.postModel.findById(postId)
    if (post) return post;
    return {
      message: `Post with id ${postId} does not exists.`
    }
  }

  async update(userId: string, postId: string, updatePostDto: UpdatePostDto) {
    const canEdit = await this.checkUserAcces(userId, postId);
    if (!canEdit) {
      return { message: "You can't edit other user post." }
    }

    const post = await this.postModel.findByIdAndUpdate(postId, updatePostDto, {
      new: true
    });
    if (post) return post;
    return { message: `Post with id ${postId} does not exists.` }
  }

  async remove(userId: string, postId: string): Promise<ResponseMessage> {
    const canDelete = await this.checkUserAcces(userId, postId);
    if (!canDelete) {
      return { message: "You can't delete other user post." }
    }

    const post = await this.postModel.findByIdAndDelete(postId);
    if (post) return { message: "Post deleted!" };
    return { message: `Post with id ${postId} does not exists.` }
  }

  async checkUserAcces(userId: string, postId: string): Promise<boolean> {
    const post = await this.postModel.findOne({ _id: postId, userId: userId });
    if (post) {
      return true;
    }
    return false;
  }

}
