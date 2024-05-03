import { WebResponse } from 'src/model/web.model';
import { UserOnJwt } from 'src/auth/types/user-jwt.type';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleResponse } from 'src/model/article.model';
import { CreateArticleDto, UpdateArticleDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Auth } from 'src/common/decorator';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';

@Injectable()
export class ArticleService {
  constructor(private prismaService: PrismaService) {}
  async create(
    user: UserOnJwt,
    createDto: CreateArticleDto,
    thumbnail: string,
  ): Promise<ArticleResponse> {
    const newArticle = await this.prismaService.article.create({
      data: { ...createDto, thumbnail, author_id: user.sub },
      include: {
        author: true,
      },
    });
    // Membuat salinan artikel tanpa password pengguna
    const { author, ...articleWithoutAuthorPassword } = newArticle;
    delete author.password;

    return { ...articleWithoutAuthorPassword, author };
  }

  async getAll(
    title?: string,
    size: number = 12,
    page: number = 1,
  ): Promise<WebResponse<ArticleResponse[]>> {
    const where = {
      title: {
        contains: title,
      },
    };
    return await this.paginateArticle(size, page, where);
  }

  async getByUser(
    @Auth() user: UserOnJwt,
    title?: string,
    size: number = 12,
    page: number = 1,
  ): Promise<WebResponse<ArticleResponse[]>> {
    const where: Prisma.ArticleWhereInput = {
      author_id: user.sub,
      AND: { title: { contains: title } },
    };

    return await this.paginateArticle(size, page, where);
  }

  async getDetail(articleId: number): Promise<ArticleResponse> {
    const article = await this.prismaService.article.findUnique({
      where: { id: articleId },
    });
    return article;
  }

  async update(
    articleId: number,
    updateArticleDto: UpdateArticleDto,
    thumbnail: string,
  ): Promise<ArticleResponse> {
    const article = await this.prismaService.article.findUnique({
      where: { id: articleId },
    });
    if (!article) throw new NotFoundException('article not found');
    if (thumbnail) {
      // Menghapus thumbnail lama jika ada
      const oldThumbnailPath = `./${article.thumbnail}`;
      if (fs.existsSync(oldThumbnailPath)) {
        fs.unlinkSync(oldThumbnailPath);
      }
    }
    const updatedArticle = await this.prismaService.article.update({
      where: { id: articleId },
      data: {
        ...updateArticleDto,
        thumbnail,
      },
    });
    return updatedArticle;
  }

  async delete(articleId: number): Promise<ArticleResponse> {
    const article = await this.prismaService.article.findUnique({
      where: { id: articleId },
    });

    if (!article) throw new NotFoundException('article not found');

    const oldThumbnailPath = `./${article.thumbnail}`;
    if (fs.existsSync(oldThumbnailPath)) {
      fs.unlinkSync(oldThumbnailPath);
    }
    const deletedArticle = await this.prismaService.article.delete({
      where: { id: articleId },
    });
    return deletedArticle;
  }

  async paginateArticle(
    size: number = 12,
    page: number = 1,
    where: Prisma.ArticleWhereInput,
  ) {
    const articles = await this.prismaService.article.findMany({
      where,
      include: {
        author: true,
      },
      take: size,
      skip: page > 1 ? (page - 1) * size : 0,
    });

    const total = await this.prismaService.article.count({
      where,
    });
    return {
      data: articles,
      pagination: {
        size,
        current_page: page,
        total_page: Math.ceil(total / size),
      },
    };
  }
}
