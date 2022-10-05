import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schema/post.schema';

@Injectable()
export class PostService {

  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) { }

  create(createPostDto: CreatePostDto): Promise<Post> {
    createPostDto.userId = "633d8905dbf8f4306ad37f43"
    const post = new this.postModel(createPostDto);
    return post.save();
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
