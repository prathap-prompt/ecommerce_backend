import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { OrderItem } from "./oderitems";

import { Product } from "./product";

@Entity("product_variants")
export class ProductVariant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column({
    type: "varchar",
    unique: true,
  })
  sku!: string;

  @Column({
    type: "jsonb",
  })
  attributes!: Record<string, any>;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  price!: number;
    oderitems: any;

 

@OneToMany(() => OrderItem, (item) => item.productVariant)
orderItems!: OrderItem[];
    
}