import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

}
