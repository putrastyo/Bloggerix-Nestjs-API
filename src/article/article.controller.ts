import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Auth, Public } from 'src/common/decorator';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponse } from 'src/model/article.model';
import { WebResponse } from 'src/model/web.model';
import { UserOnJwt } from 'src/auth/types/user-jwt.type';
import { AtGuard } from 'src/common/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { UpdateArticleDto } from './dto';

@Controller('api/articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @UseGuards(AtGuard)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: './uploads/thumbnail',
        filename: (req, file, cb) => {
          const fileName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  @Post()
  async create(
    @Auth() user: UserOnJwt,
    @Body() createDto: CreateArticleDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ): Promise<WebResponse<ArticleResponse>> {
    if (!thumbnail) {
      throw new BadRequestException('thumbnail is required');
    }
    const result = await this.articleService.create(
      user,
      createDto,
      thumbnail.path,
    );
    return {
      data: result,
    };
  }

  @Public()
  @Get('/thumbnail/:imgpath')
  getThumbnail(@Param('imgpath') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: './uploads/thumbnail' });
  }

  @Public()
  @Get()
  getAll(
    @Query('title') title?: string,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  ) {
    return this.articleService.getAll(title, size, page);
  }

  @UseGuards(AtGuard)
  @Get('/user')
  getByUser(
    @Auth() user: UserOnJwt,
    @Query('title') title?: string,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  ) {
    return this.articleService.getByUser(user, title, size, page);
  }

  @Public()
  @Get(':articleId')
  getDetail(@Param('articleId', ParseIntPipe) articleId: number) {
    return this.articleService.getDetail(articleId);
  }

  @UseGuards(AtGuard)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: './uploads/thumbnail',
        filename: (req, file, cb) => {
          const fileName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  @Put(':articleId')
  update(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    if (!thumbnail) {
      throw new BadRequestException('thumbnail is required');
    }

    return this.articleService.update(
      articleId,
      updateArticleDto,
      thumbnail.path,
    );
  }

  @UseGuards(AtGuard)
  @Delete(':articleId')
  delete(@Param('articleId', ParseIntPipe) articleId: number) {
    return this.articleService.delete(articleId);
  }
}
