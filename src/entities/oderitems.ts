import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Order } from "./oders";
import { ProductVariant } from "./productvarients";

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @ManyToOne(() => ProductVariant, (variant) => variant.oderitems, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "product_variant_id" })
  productVariant!: ProductVariant;

  @Column({
    name: "product_name",
    type: "varchar",
    length: 255,
  })
  productName!: string;

  @Column({
    type: "int",
  })
  quantity!: number;

  @Column({
    name: "unit_price",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  unitPrice!: number;
}