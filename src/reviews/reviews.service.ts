import { ConflictException, Injectable, NotFoundException,ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { Review } from 'src/entities/reviews';
import { OrderItem } from 'src/entities/oderitems';
import { Order } from 'src/entities/oders';
import { OrderStatus } from 'src/enums/oderstatus';
import { CreateReviewDto } from './dtos/reviewdto';
@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ){}

    async findForProduct(productId:string){
        const reviews= await this.reviewRepository.find({
            where : {product:{id:productId}},
            order : {createdAt:'desc'},
           

        });

    const average =
      reviews.length === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

     return {
      reviews,
      averageRating: Number(average.toFixed(1)),
      totalReviews: reviews.length,
       };
    }
    private async hasPurchased(userId: string, productId: string): Promise<boolean> {
    // Checks whether this user has a DELIVERED order containing this product
    const item = await this.orderItemRepository
      .createQueryBuilder('item')
      .innerJoin(Order, 'order', 'order.id = item.order_id')
      .where('item.product_id = :productId', { productId })
      .andWhere('order.user_id = :userId', { userId })
      .andWhere('order.status = :status', { status: OrderStatus.DELIVERED })
      .getExists();

    return item;
  }
  async create(userId: string, productId: string, dto: CreateReviewDto): Promise<Review> {
    const purchased = await this.hasPurchased(userId, productId);
    if (!purchased) {
      throw new ForbiddenException(
        'You can only review products from a delivered order',
      );
    }

    const existing = await this.reviewRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (existing) {
      throw new ConflictException('You already reviewed this product');
    }
     const review = new Review();
    review.user_id= userId;
    review.productId = productId;
    review.rating = dto.rating;
    review.comment = dto.comment;
    return this.reviewRepository.save(review);
  }
  async remove(userId: string, reviewId: string): Promise<void> {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own review');
    }
    await this.reviewRepository.remove(review);
  }



}
