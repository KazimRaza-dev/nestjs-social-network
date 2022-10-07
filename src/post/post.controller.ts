import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from "./dto/update-post.dto";
import { ReqUserDto } from "../user/dto/req-user.dto";
import { ReqUser } from '../user/dacorator/user.dacorator';
import { JoiValidationPipe } from 'src/auth/pipes/validation.pipe';
import { createPostSchema } from './joi-schemas/createPostSchema.schema';
import { updatePostSchema } from './joi-schemas/updatePost.schema';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService,) { }

  @Post()
  async create(
    @ReqUser() user: ReqUserDto,
    @Body(new JoiValidationPipe(createPostSchema)) createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto, user.id);
  }

  @Get()
  findAll(@ReqUser() user: ReqUserDto) {
    return this.postService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') postId: string) {
    return this.postService.findOne(postId);
  }

  @Patch(':id')
  update(
    @ReqUser() user: ReqUserDto,
    @Param('id') postId: string,
    @Body(new JoiValidationPipe(updatePostSchema)) updatePostDto: UpdatePostDto) {
    return this.postService.update(user.id, postId, updatePostDto);
  }

  @Delete(':id')
  remove(@ReqUser() user: ReqUserDto, @Param('id') postId: string) {
    return this.postService.remove(user.id, postId);
  }
}
