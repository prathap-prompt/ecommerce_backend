import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

import { users } from "./users.entity";
import { OrderItem } from "./oderitems";
import { OrderStatus } from "../enums/oderstatus";
import { Payment } from "./payments";
import { Review } from "./reviews";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() =>users,(users)=> users.orders,{
    eager:true,
    // nullable: false,
    // onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: users;

 

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Column({
    name: "total_amount",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  totalAmount!: number;

  @Column({
    name: "shipping_address",
    type: "text",
  })
  shippingAddress!: string;

  @Column({
    name: "billing_address",
    type: "jsonb",
    nullable: true,
  })
  billingAddress?: Record<string, any>;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt!: Date;

  @OneToMany(() => OrderItem, (item) => item.order)
  orderItems!: OrderItem[];
    Payment: any;

    

@OneToMany(() => Payment, (payment) => payment.order)
payments!: Payment[];


@OneToMany(() => Review, (review) => review.order)
reviews!: Review[];
}