
import { PartialType } from '@nestjs/mapped-types';
import { ProductDto } from './productsDto';

export class UpdateProductDto extends PartialType(ProductDto) {}