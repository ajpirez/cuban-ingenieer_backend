import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    default: 10,
    description: 'Elements by page',
  })
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    default: 1,
    description: 'Requested results page',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  page?: number;
}
