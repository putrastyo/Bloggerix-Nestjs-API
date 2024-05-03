import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  @MaxLength(100)
  text: string;
}
