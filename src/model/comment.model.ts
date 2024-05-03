import { ArticleResponse } from './article.model';
import { UserResponse } from './user.model';

export class CommentResponse {
  id: number;
  text: string;
  user_id: number;
  article_id: number;
  user: UserResponse;
  article: ArticleResponse;
}
