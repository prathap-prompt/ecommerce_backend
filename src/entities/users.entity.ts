import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './oders';
import { Review } from './reviews';
import { Userrole } from '../enums/userRole';





@Entity('users')
export class users {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ name: 'full_name' })
  full_name!: string;

  @Column({ type: 'varchar', length: '20' })
  phone!: string;

  @Column({type:'enum',enum:Userrole, default: 'customer' })
  role!: string;

  @Column({ default: false, name: 'is_email_verified' })
  is_email_verified!: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[];
}