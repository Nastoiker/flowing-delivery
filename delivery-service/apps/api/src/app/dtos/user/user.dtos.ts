import { IsNumber, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  name: string;
  @IsString()
  surname: string;

  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
  @IsNumber()
  roles: number;
}
