
import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @MinLength(10)
  shippingAddress!: string;
}