import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity("warehouses")
export class Warehouse {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  name!: string;

  @Column({
    type: "jsonb",
  })
  address!: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  @Column({
    name: "is_active",
    type: "boolean",
    default: true,
  })
  isActive!: boolean;
}