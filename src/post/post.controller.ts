import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/index.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  findAll() {
    const userId = "633e651398e0b043a4439f5d";
    return this.postService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') postId: string) {
    const userId = "633e651398e0b043a4439f5d";
    return this.postService.findOne(userId, postId);
  }

  @Patch(':id')
  update(@Param('id') postId: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(postId, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') postId: string) {
    return this.postService.remove(postId);
  }
}
