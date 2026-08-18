import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/oders';
import { Product } from 'src/entities/product';
import { OrderItem } from 'src/entities/oderitems';
import { Cart } from 'src/entities/cart';

@Module({
  imports:[TypeOrmModule.forFeature([Order,Product,OrderItem,Cart])],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
