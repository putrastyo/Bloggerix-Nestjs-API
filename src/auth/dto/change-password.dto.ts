import { IsNotEmpty, ValidateIf } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  old_password: string;

  @IsNotEmpty()
  new_password: string;

  @IsNotEmpty()
  @ValidateIf(
    (o: ChangePasswordDto) => o.new_password !== o.confirm_new_password,
  )
  confirm_new_password: string;
}
