import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { users } from "./users.entity";

@Entity("address")
export class Address {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => users, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  users!: users;

  @Column({
    type: "varchar",
    length: 100,
  })
  label!: string;

  @Column({
    type: "varchar",
    length: 255,
    name: "line1",
  })
  line1!: string;

  @Column({
    type: "varchar",
    length: 255,
    name: "line2",
    nullable: true,
  })
  line2?: string;

  @Column({
    type: "varchar",
    length: 100,
  })
  city!: string;

  @Column({
    type: "varchar",
    length: 100,
  })
  state!: string;

  @Column({
    type: "varchar",
    length: 100,
  })
  country!: string;

  @Column({
    name: "postal_code",
    type: "varchar",
    length: 20,
  })
  postalCode!: string;

  @Column({
    name: "is_default",
    type: "boolean",
    default: false,
  })
  isDefault!: boolean;
}
