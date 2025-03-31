import { Controller, Post, Get, Put, Param, Body, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    createOrder(@Request() req, @Body() body: { regionId: string; packageId: string }) {
        return this.orderService.createOrder(req.user.userId, body.regionId, body.packageId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getUserOrders(@Request() req) {
        return this.orderService.getUserOrders(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateOrderStatus(@Param('id') orderId: string, @Body() body: { status: string }) {
        return this.orderService.updateOrderStatus(orderId, body.status);
    }
}
