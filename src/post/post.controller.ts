import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, DefaultValuePipe } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from "./dto/update-post.dto";
import { ReqUserDto } from "../user/dto/req-user.dto";
import { ReqUser } from '../user/dacorator/user.dacorator';
import { RolesGuard } from 'src/user/guard/role.guard';
import { ResponseMessage } from './dto/response.dto';
import { SocialPost } from './schema/post.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService,) { }

  @Post()
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async create(
    @ReqUser() user: ReqUserDto,
    @Body() createPostDto: CreatePostDto): Promise<SocialPost> {
    return this.postService.create(createPostDto, user.id);
  }

  @Get('/all/:id')
  @UseGuards(JwtAuthGuard)
  async findAll(@Param('id') userId: string,
    @Query('pageNo', new DefaultValuePipe("1")) pageNo: string,
    @Query('size', new DefaultValuePipe("5")) size: string
  ): Promise<SocialPost[] | ResponseMessage> {

    return this.postService.findAll(userId, pageNo, size);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') postId: string): Promise<SocialPost | ResponseMessage> {
    return this.postService.findOne(postId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @ReqUser() user: ReqUserDto,
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto): Promise<SocialPost | ResponseMessage> {

    return this.postService.update(user.id, user.role, postId, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@ReqUser() user: ReqUserDto, @Param('id') postId: string): Promise<ResponseMessage> {
    return this.postService.remove(user.id, user.role, postId);
  }

  @Patch('/like/:id')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async likePost(@ReqUser() user: ReqUserDto, @Param('id') postId: string): Promise<SocialPost | ResponseMessage> {
    return this.postService.likePost(user.id, postId)
  }

  @Patch('/dislike/:id')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async dislikePost(@ReqUser() user: ReqUserDto, @Param('id') postId: string): Promise<SocialPost | ResponseMessage> {
    return this.postService.dislikePost(user.id, postId)
  }

}
