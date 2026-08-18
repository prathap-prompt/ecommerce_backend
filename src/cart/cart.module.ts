import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cartitems } from 'src/entities/cartitems';
import { Cart } from 'src/entities/cart';
import { Product } from 'src/entities/product';

@Module({
  imports:[TypeOrmModule.forFeature([cartitems,Cart,Product])],
  controllers: [CartController],
  providers: [CartService],
  exports:[CartService]
})
export class CartModule {}
