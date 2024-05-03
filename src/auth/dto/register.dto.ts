import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsNotEmpty()
  @ValidateIf((o: RegisterDto) => o.password !== o.confirm_password)
  confirm_password: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  role: 'ADMIN' | 'USER';
}
