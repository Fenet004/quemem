import { Controller, Post, Get, Body, Param, Request, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    createPayment(@Request() req, @Body() body: { orderId: string }) {
        return this.paymentService.createPayment(req.user.userId, body.orderId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('confirm/:stripePaymentId')
    confirmPayment(@Param('stripePaymentId') stripePaymentId: string) {
        return this.paymentService.confirmPayment(stripePaymentId);
    }
}
