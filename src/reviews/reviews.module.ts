import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/reviews';
import { Order } from 'src/entities/oders';
import { OrderItem } from 'src/entities/oderitems';

@Module({
  imports: [TypeOrmModule.forFeature([Review,OrderItem,Order])],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
