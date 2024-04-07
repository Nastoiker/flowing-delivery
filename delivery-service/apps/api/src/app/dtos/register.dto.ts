import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
  @IsString()
  name: string;
  @IsString()
  surname: string;
  @IsString()
  username: string;
  @IsOptional()
  @IsString()
  displayName?: string;
}
