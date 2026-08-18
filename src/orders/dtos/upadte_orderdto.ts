
import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/enums/oderstatus';


export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}