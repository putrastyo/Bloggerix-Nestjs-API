import { UserResponse } from './user.model';

export class ArticleResponse {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string;
  author_id: number;
  author?: UserResponse;
  created_at: Date;
  updated_at: Date;
}
