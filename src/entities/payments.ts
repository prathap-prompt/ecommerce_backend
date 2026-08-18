import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

import { Order } from "./oders";
import { PaymentStatus } from "../enums/paymentstatus";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Order, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @Column({
    type: "varchar",
    length: 100,
  })
  provider!: string;

  @Column({
    name: "provider_txn_id",
    type: "varchar",
    length: 255,
    unique: true,
  })
  providerTxnId!: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  amount!: number;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.INITIATED,
  })
  status!: PaymentStatus;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt!: Date;
}