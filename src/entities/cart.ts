// src/cart/entities/cart.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { users } from './users.entity';
import { cartitems } from './cartitems';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: users;

  @Column()
  userId!: string;

  @OneToMany(() => cartitems, (item) => item.cart, {
    cascade: true, // saving a Cart also saves its items
  })
  items!: cartitems[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}