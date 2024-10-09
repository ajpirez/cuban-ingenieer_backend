import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNameDto {
  @ApiProperty({ description: 'The new name for the user', example: 'John Doe' })
  @IsNotEmpty()
  name: string;
}
