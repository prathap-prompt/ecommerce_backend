import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Check,
  Unique
} from "typeorm";

import { users } from "./users.entity";
import { Product } from "./product";
import { Order } from "./oders";

@Entity("reviews")
@Unique(["user", "product", "order"])
@Check(`"rating" BETWEEN 1 AND 5`)
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Product, (product) => product.reviews, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @ManyToOne(() => users, (user) => user.reviews, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: users;

  @ManyToOne(() => Order, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @Column({
    type: "int",
  })
  rating!: number;

  @Column({
    type: "text",
  })
  comment!: string;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt!: Date;
  productId: string;
  user_id: string;
}