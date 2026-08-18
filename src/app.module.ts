import './env';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db';
import { AuthModule } from './auth/auth.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ReviewsModule } from './reviews/reviews.module';

const parsePort = (value: string | undefined, fallback: number): number => {
  const port = Number(value);
  return Number.isInteger(port) && port > 0 ? port : fallback;
};

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    CatalogsModule,
    CartModule,
    OrdersModule,
    WishlistModule,
    ReviewsModule,
    ThrottlerModule.forRoot([
      {
        ttl:60000,
        limit: 20,
      },
    ]),
    HealthModule,
    WishlistModule,
    ReviewsModule
  ],
  controllers: [AppController],
  providers: [AppService,{provide:APP_GUARD,useClass: ThrottlerGuard,},
  ],
})
export class AppModule {}
