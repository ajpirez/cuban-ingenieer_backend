import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'User email', example: 'johndoe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password for the account', example: 'password123', minLength: 8 })
  @MinLength(8)
  password: string;
}
