// src/orders/orders.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create_orderdto';
import { UpdateOrderStatusDto } from './dtos/upadte_orderdto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guards';
import { Roles } from '../decoraters/roles.decorator';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.createFromcart(req.user.id, dto);
  }

  @Get()
  findMine(@Req() req) {
    return this.ordersService.findAllForUser(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    const isAdmin = req.user.role === 'admin';
    return this.ordersService.findOne(id, req.user.id, isAdmin);
  }

  // ---- Admin-only ----

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('admin/all')
  findAllAdmin() {
    return this.ordersService.findAllAdmin();
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
