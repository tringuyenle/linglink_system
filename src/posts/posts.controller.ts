import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { CreatePostDTO } from './dto/createPost.dto';
import { UpdatePostDTO } from './dto/updatePost.dto';
import { PostsService } from './posts.service';
import { AdminGuard } from '../auth/guard/admin.guard';

//@UseGuards(MyJwtGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(MyJwtGuard)
  createPost(@Req() req, @Body() createPostDto: CreatePostDTO) {
    try {
      // Gọi service để tạo câu hỏi khi xác thực thành công
      return this.postsService.createPost(req.user, createPostDto);
    } catch (error) {
      // Nếu có lỗi xác thực, trả về mã trạng thái 401
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  @UseGuards(MyJwtGuard)
  getPostById(@Req() req, @Query('id') postId: string) {
    const userId = req.user._id.toString();
    return this.postsService.getPostWithReactById(userId, postId);
  }

  @Get('topic/:id')
  getPostByTopic(@Param('id') id: string) {
    return this.postsService.getPostByTopic(id);
  }

  @Put(':id')
  @UseGuards(MyJwtGuard)
  updatePostById(
    @Req() req,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDTO,
  ) {
    return this.postsService.updatePostById(req.user, id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(MyJwtGuard)
  removePostById(@Req() req, @Param('id') id: string) {
    return this.postsService.removePostById(req.user, id);
  }

  @Get('page')
  getAllPostsByPage(
    @Query('lastPostId') lastPostId: string,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.postsService.getAllPostsByPage(lastPostId, pageSize);
  }

  @Get('page')
  @Version('2')
  @UseGuards(MyJwtGuard)
  getAllPostsByPagev2(
    @Req() req,
    @Query('lastPostTime') lastPostTime: Date,
    @Query('pageSize') pageSize: number = 10,
    @Query('topic') topic: string,
    @Query('author') author: string,
    @Query('lastFetchTime') lastFetchTime: Date,
  ) {
    const userId = req.user._id.toString();
    return this.postsService.getAllPostsByPagev2(
      lastPostTime,
      userId,
      pageSize,
      topic,
      author,
      lastFetchTime,
    );
  }

  @UseGuards(AdminGuard)
  @Get('admin')
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.postsService.getPosts(
      page,
      limit,
    );
  }
}
