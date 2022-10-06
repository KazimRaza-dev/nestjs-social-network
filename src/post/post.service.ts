import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { timeStamp } from 'console';
import { Model } from 'mongoose';
import { CreatePostDto, UpdatePostDto } from './dto/index.dto';
import { Post, PostDocument } from './schema/post.schema';

@Injectable()
export class PostService {

  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) { }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    createPostDto.userId = "633e651398e0b043a4439f5d";
    const post = new this.postModel(createPostDto);
    return post.save();
  }

  async findAll(userId: string): Promise<Post[]> {
    const posts = await this.postModel.find({ userId: userId })
    return posts;
  }

  async findOne(userId: string, postId: string): Promise<Post> {
    const post = await this.postModel.findOne({ _id: postId, userId: userId })
    return post;
  }

  update(postId: string, updatePostDto: UpdatePostDto) {
    const post = this.postModel.findByIdAndUpdate(postId, updatePostDto, {
      new: true
    });
    return post;
  }

  async remove(postId: string): Promise<Post> {
    const post = await this.postModel.findByIdAndDelete(postId);
    return post;
  }
}
