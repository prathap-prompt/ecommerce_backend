// src/wishlist/wishlist.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AddWishlistItemDto } from './dto/wishlist_item.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Wishlist')
@ApiBearerAuth()
@Controller('wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  findAll(@Req() req) {
    return this.wishlistService.findAll(req.user.id);
  }

  @Post()
  addItem(@Req() req, @Body() dto: AddWishlistItemDto) {
    return this.wishlistService.addItem(req.user.id, dto);
  }

  @Delete(':productId')
  removeItem(@Req() req, @Param('productId') productId: string) {
    return this.wishlistService.removeItem(req.user.id, productId);
  }
}
