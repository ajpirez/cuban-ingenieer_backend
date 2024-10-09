import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'Title of the task', example: 'Complete assignment' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Status of task completion', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
