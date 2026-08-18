import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";

import { Category } from "./categories";
import { ProductVariant } from "./productvarients";
import { Review } from "./reviews";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  name!: string;

  @Column({
    type: "text",
  })
  description!: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  basePrice!: number;

  @Column()
  stock!:number;

  @Column({
    name: "is_active",
    type: "boolean",
    default: true,
  })
  isActive!: boolean;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt!: Date;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants!: ProductVariant[];






  @OneToMany(() => Review, (review) => review.product)
  reviews!: Review[];
}