import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('user')
export class UserController {
    constructor(private prisma: PrismaService) {}

    @UseGuards(JwtAuthGuard)
    @Get('orders')
    async getUserOrders(@Request() req) {
        return this.prisma.order.findMany({
            where: { userId: req.user.userId },
            include: {
                region: true,
                package: true,
                payment: true,
            },
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('payments')
    async getUserPayments(@Request() req) {
        return this.prisma.payment.findMany({
            where: { userId: req.user.userId },
            include: {
                order: true,
            },
        });
    }
}
