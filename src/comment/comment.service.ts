import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { CommentResponse } from 'src/model/comment.model';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createCommentDto: CreateCommentDto,
    articleId: number,
    userId: number,
  ): Promise<CommentResponse> {
    const newComment = await this.prismaService.comment.create({
      data: {
        ...createCommentDto,
        article_id: articleId,
        user_id: userId,
      },
      include: {
        user: true,
        article: true,
      },
    });

    return newComment;
  }

  async getAll(articleId: number): Promise<CommentResponse[]> {
    const comments = await this.prismaService.comment.findMany({
      where: { article_id: articleId },
      include: { user: true, article: true },
    });

    return comments;
  }

  async update(
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponse> {
    const isCommentExist = await this.prismaService.comment.findUnique({
      where: { id: commentId },
    });
    if (!isCommentExist) throw new NotFoundException('comment not found');
    const updatedComment = await this.prismaService.comment.update({
      where: { id: commentId },
      include: { user: true, article: true },
      data: updateCommentDto,
    });
    return updatedComment;
  }

  async delete(commentId: number): Promise<CommentResponse> {
    const deletedComment = await this.prismaService.comment.delete({
      where: { id: commentId },
      include: { user: true, article: true },
    });

    return deletedComment;
  }
}
