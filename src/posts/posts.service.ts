import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePostDto } from "./create-post.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Post } from "./post.model";
import { FilesService } from "../files/files.service";

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private fileService: FilesService
  ) {}

  async getAllPosts() {
    return await this.postRepository.findAll({ include: { all: true } });
  }

  async createPost(dto: CreatePostDto, image: any) {
    const postIsExist = await this.postRepository.findOne({
      where: { title: dto.title },
    });
    if (postIsExist)
      throw new HttpException(
        `Post with title ${dto.title}  is exists`,
        HttpStatus.BAD_REQUEST
      );

    const fileName = await this.fileService.createFile(image);
    return await this.postRepository.create({ ...dto, image: fileName });
  }

  async updatePost(id: number, dto: CreatePostDto) {
    return this.postRepository.update(
      { ...dto },
      {
        where: { id: id },
        returning: true,
      }
    );
  }

  async removePost(id: number) {
    const post = await this.postRepository.findOne({
      where: { id: id },
    });

    if (!post) throw new HttpException("Post not found", HttpStatus.NOT_FOUND);

    await post.destroy();
    return post;
  }
}
