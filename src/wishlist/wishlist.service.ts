
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from 'src/entities/wishlist';
import { Product } from 'src/entities/product';
import { AddWishlistItemDto } from './dto/wishlist_item.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private wishlistRepo: Repository<WishlistItem>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async findAll(userId: string): Promise<WishlistItem[]> {
    return this.wishlistRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async addItem(userId: string, dto: AddWishlistItemDto): Promise<WishlistItem> {
    const product = await this.productRepo.findOne({
      where: { id: dto.productId, isActive: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.wishlistRepo.findOne({
      where: { userId, productId: dto.productId },
    });
    if (existing) {
      throw new ConflictException('Product already in wishlist');
    }

    const item = new WishlistItem();
    item.userId = userId;
    item.productId = dto.productId;
    return this.wishlistRepo.save(item);
  }

  async removeItem(userId: string, productId: string): Promise<void> {
    const item = await this.wishlistRepo.findOne({
      where: { userId, productId },
    });
    if (!item) {
      throw new NotFoundException('Item not in wishlist');
    }
    await this.wishlistRepo.remove(item);
  }
}
