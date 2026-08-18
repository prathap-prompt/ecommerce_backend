import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderStatus } from 'src/enums/oderstatus';
import { Order } from 'src/entities/oders';
import { OrderItem } from 'src/entities/oderitems';
import { Cart } from 'src/entities/cart';
import { Product} from 'src/entities/product';
import { CreateOrderDto } from './dtos/create_orderdto';
import { UpdateOrderStatusDto } from './dtos/upadte_orderdto';




@Injectable()
export class OrdersService {
    constructor( @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    private dataSource: DataSource, // needed for transactions
  ) {}

  async createFromcart(userId: string,dto: CreateOrderDto):Promise<Order>{
    const cart=await this.cartRepo.findOne({
        where:{userId},
        relations:{
            items:{
                product:true
            }
        }
    })

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
     return this.dataSource.transaction(async (manager) => {
      let total = 0;
      const orderItems: OrderItem[] = [];

      for (const cartItem of cart.items) {
        const product = await manager.findOne(Product, {
          where: { id: cartItem.productId },
          lock: { mode: 'pessimistic_write' }, // locks the row until transaction ends
        });

        if (!product || !product.isActive) {
          throw new BadRequestException(
            `Product "${cartItem.product.name}" is no longer available`,
          );
        }

        if (product.stock < cartItem.quantity) {
          throw new BadRequestException(
            `Not enough stock for "${product.name}". Only ${product.stock} left.`,
          );
        }

        // Decrement stock now, inside the same transaction
        product.stock -= cartItem.quantity;
        await manager.save(product);

        const orderItem = manager.create(OrderItem, {
          productId: product.id,
          productName: product.name,
          priceAtPurchase: product.basePrice,
          quantity: cartItem.quantity,
        });
        orderItems.push(orderItem);

        total += Number(product.basePrice) * cartItem.quantity;
      }

    const order = manager.create(Order, {
     user:{id:userId} ,
     orderItems: orderItems,
     totalAmount: Number(total.toFixed(2)),
     shippingAddress: dto.shippingAddress,
     status: OrderStatus.PENDING,
    });

const savedOrder = await manager.save(order);
      // Empty the cart now that it's been converted to an order
      await manager.delete('cart_items', { cartId: cart.id });

      return savedOrder;
    });
  }

  async findAllForUser(userId: string): Promise<any[]> {
    const orders = await this.orderRepo.find({
      where: { user: { id: userId } },
      relations: { orderItems: true },
      order: { createdAt: 'DESC' },
    });
    return orders.map((o) => ({
      ...o,
      items: o.orderItems || [],
    }));
  }

  async findOne(id: string, userId: string, isAdmin: boolean): Promise<any> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: { orderItems: true },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    // Non-admins can only view their own orders
    if (!isAdmin && order.user?.id !== userId) {
      throw new NotFoundException('Order not found');
    }
    return {
      ...order,
      items: order.orderItems || [],
    };
  }

  async findAllAdmin(): Promise<any[]> {
    const orders = await this.orderRepo.find({
      relations: { orderItems: true },
      order: { createdAt: 'DESC' },
    });
    return orders.map((o) => ({
      ...o,
      items: o.orderItems || [],
    }));
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = dto.status;
    return this.orderRepo.save(order);
  }
}

  



