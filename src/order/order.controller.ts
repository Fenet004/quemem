import { Controller, Post, Get, Put, Param, Body, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Order')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiBody({ schema: { example: { regionId: 'region-id-uuid', packageId: 'package-id-uuid' } } })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    createOrder(@Request() req, @Body() body: { regionId: string; packageId: string }) {
        return this.orderService.createOrder(req.user.userId, body.regionId, body.packageId);
    }

    
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Update the status of an order' })
    @ApiParam({ name: 'id', description: 'The ID of the order to update' })
    @ApiBody({ schema: { example: { status: 'COMPLETED' } } })
    @ApiResponse({ status: 200, description: 'Order status updated successfully' })
    updateOrderStatus(@Param('id') orderId: string, @Body() body: { status: string }) {
        return this.orderService.updateOrderStatus(orderId, body.status);
    }
}
