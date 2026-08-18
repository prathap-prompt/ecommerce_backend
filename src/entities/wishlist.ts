// src/wishlist/entities/wishlist-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { users } from "./users.entity";
import { Product } from './product';

@Entity('wishlist_items')
@Unique(['userId', 'productId']) // can't save the same product twice
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: users;

  @Column()
  userId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @CreateDateColumn()
  createdAt: Date;
}