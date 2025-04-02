import { Controller, Post, Get, Body, Param, Request, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payments')
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    @ApiOperation({ summary: 'Create a new payment for an order' })
    @ApiBody({ schema: { example: { orderId: 'order-id-uuid' } } })
    @ApiResponse({ status: 201, description: 'Payment created and client secret returned' })
    createPayment(@Request() req, @Body() body: { orderId: string }) {
        return this.paymentService.createPayment(req.user.userId, body.orderId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('confirm/:stripePaymentId')
    @ApiOperation({ summary: 'Confirm a Stripe payment by ID' })
    @ApiParam({ name: 'stripePaymentId', description: 'Stripe Payment ID to confirm' })
    @ApiResponse({ status: 200, description: 'Payment confirmed and order marked as completed' })
    confirmPayment(@Param('stripePaymentId') stripePaymentId: string) {
        return this.paymentService.confirmPayment(stripePaymentId);
    }
}
