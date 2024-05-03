import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AtGuard } from 'src/common/guard';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { Auth, Public } from 'src/common/decorator';
import { UserOnJwt } from 'src/auth/types/user-jwt.type';

@Controller('api/articles/:articleId/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(AtGuard)
  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Auth() user: UserOnJwt,
  ) {
    return this.commentService.create(createCommentDto, articleId, user.sub);
  }

  @Public()
  @Get()
  getAll(@Param('articleId', ParseIntPipe) articleId: number) {
    return this.commentService.getAll(articleId);
  }

  @UseGuards(AtGuard)
  @Put(':commentId')
  update(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(commentId, updateCommentDto);
  }

  @UseGuards(AtGuard)
  @Delete(':commentId')
  delete(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentService.delete(commentId);
  }
}
