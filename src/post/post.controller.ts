import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from "./dto/update-post.dto";
import { ReqUserEntity } from "../user/dto/req-user.dto";
import { User } from '../user/dacorator/user.dacorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService,) { }

  @Post()
  async create(@User() user: ReqUserEntity, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto, user.id);
  }

  @Get()
  findAll(@User() user: ReqUserEntity) {
    return this.postService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') postId: string) {
    return this.postService.findOne(postId);
  }

  @Patch(':id')
  update(@User() user: ReqUserEntity, @Param('id') postId: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(user.id, postId, updatePostDto);
  }

  @Delete(':id')
  remove(@User() user: ReqUserEntity, @Param('id') postId: string) {
    return this.postService.remove(user.id, postId);
  }
}
