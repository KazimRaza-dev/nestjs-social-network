import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from "./dto/update-post.dto";
import { ReqUserDto } from "../user/dto/req-user.dto";
import { ReqUser } from '../user/dacorator/user.dacorator';
import { JoiValidationPipe } from 'src/auth/pipes/validation.pipe';
import { createPostSchema } from './joi-schemas/createPostSchema.schema';
import { updatePostSchema } from './joi-schemas/updatePost.schema';
import { RolesGuard } from 'src/user/guard/role.guard';
import { ResponseMessage } from './dto/response.dto';
import { SocialPost } from './schema/post.schema';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService,) { }

  @Post()
  @UseGuards(RolesGuard)
  async create(
    @ReqUser() user: ReqUserDto,
    @Body(new JoiValidationPipe(createPostSchema)) createPostDto: CreatePostDto): Promise<SocialPost> {
    return this.postService.create(createPostDto, user.id);
  }

  @Get('/all/:id')
  async findAll(@Param('id') userId: string): Promise<SocialPost[] | ResponseMessage> {
    return this.postService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') postId: string): Promise<SocialPost | ResponseMessage> {
    return this.postService.findOne(postId);
  }

  @Patch(':id')
  async update(
    @ReqUser() user: ReqUserDto,
    @Param('id') postId: string,
    @Body(new JoiValidationPipe(updatePostSchema)) updatePostDto: UpdatePostDto): Promise<SocialPost | ResponseMessage> {

    return this.postService.update(user.id, user.role, postId, updatePostDto);
  }

  @Delete(':id')
  async remove(@ReqUser() user: ReqUserDto, @Param('id') postId: string): Promise<ResponseMessage> {
    return this.postService.remove(user.id, user.role, postId);
  }

  @Patch('/like/:id')
  @UseGuards(RolesGuard)
  async likePost(@ReqUser() user: ReqUserDto, @Param('id') postId: string): Promise<SocialPost | ResponseMessage> {
    return this.postService.likePost(user.id, postId)
  }

  @Patch('/dislike/:id')
  @UseGuards(RolesGuard)
  async dislikePost(@ReqUser() user: ReqUserDto, @Param('id') postId: string): Promise<SocialPost | ResponseMessage> {
    return this.postService.dislikePost(user.id, postId)
  }


}
