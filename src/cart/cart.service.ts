
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart} from 'src/entities/cart';
import { cartitems } from 'src/entities/cartitems';
import { Product } from 'src/entities/product';
import { AddItemDto } from './dtos/add_itemdto';
import { UpdateItemDto } from './dtos/updatedto';


@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    @InjectRepository(cartitems)
    private cartItemRepo: Repository<cartitems>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  // Fetch existing cart, or create an empty one for this user
  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { userId },
      relations: {
        items:{
            product:true,
        }},
    });

    if (!cart) {
      cart = this.cartRepo.create({ userId, items: [] });
      cart = await this.cartRepo.save(cart);
    }

    return cart;
  }

  async getCartWithTotal(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    return this.attachTotal(cart);
  }

  async addItem(userId: string, dto: AddItemDto) {
    const cart = await this.getOrCreateCart(userId);

    const product = await this.productRepo.findOne({
      where: { id: dto.productId, isActive: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingItem = cart.items.find(
      (item) => item.productId === dto.productId,
    );

    const desiredQuantity = existingItem
      ? existingItem.quantity + dto.quantity
      : dto.quantity;

    if (desiredQuantity > product.stock) {
      throw new BadRequestException(
        `Only ${product.stock} units of "${product.name}" available`,
      );
    }

    if (existingItem) {
      existingItem.quantity = desiredQuantity;
      await this.cartItemRepo.save(existingItem);
    } else {
      const newItem = this.cartItemRepo.create({
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
      });
      await this.cartItemRepo.save(newItem);
    }

    return this.getCartWithTotal(userId);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateItemDto) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    if (dto.quantity > item.product.stock) {
      throw new BadRequestException(
        `Only ${item.product.stock} units of "${item.product.name}" available`,
      );
    }

    item.quantity = dto.quantity;
    await this.cartItemRepo.save(item);

    return this.getCartWithTotal(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.cartItemRepo.remove(item);
    return this.getCartWithTotal(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepo.remove(cart.items);
    return this.getCartWithTotal(userId);
  }

  // Attach a computed total to a cart response without storing it in the DB
  private attachTotal(cart: Cart) {
    const total = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.basePrice) * item.quantity;
    }, 0);

    return {
      id: cart.id,
      items: cart.items,
      itemCount: cart.items.reduce((sum, i) => sum + i.quantity, 0),
      total: Number(total.toFixed(2)),
    };
  }
}

