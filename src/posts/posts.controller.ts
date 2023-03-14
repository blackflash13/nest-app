import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CreatePostDto } from "./create-post.dto";
import { PostsService } from "./posts.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("posts")
@ApiTags("Posts controller")
export class PostsController {
  constructor(private postService: PostsService) {}

  @ApiOperation({ summary: "Get All Posts" })
  @ApiResponse({ status: 200, type: [Post] })
  @Get()
  getAll() {
    return this.postService.getAllPosts();
  }

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  createPost(@Body() dto: CreatePostDto, @UploadedFile() image) {
    try {
      return this.postService.createPost(dto, image);
    } catch (e) {
      return e.message;
    }
  }

  @Patch(":id")
  changeTodo(@Param("id") id: number, @Body() dto: CreatePostDto) {
    return this.postService.updatePost(id, dto);
  }

  @Delete(":id")
  deletePost(@Param("id") id: number) {
    try {
      return this.postService.removePost(id);
    } catch (e) {
      return e.message;
    }
  }
}
