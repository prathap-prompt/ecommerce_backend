// src/wishlist/dto/add-wishlist-item.dto.ts
import { IsUUID } from 'class-validator';

export class AddWishlistItemDto {
  @IsUUID()
  productId: string;
}