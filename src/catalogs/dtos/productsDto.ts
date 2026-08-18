import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsInt,
  Min,
  IsOptional,
  IsUUID,
  MinLength,
} from 'class-validator';




export class ProductDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name!: string;


  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  stock!: number;
  
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  categoryId?: string;
}