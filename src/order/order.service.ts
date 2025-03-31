import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    async createOrder(userId: string, regionId: string, packageId: string) {
        const region = await this.prisma.region.findUnique({ where: { id: regionId }})
        if(!region) throw new BadRequestException('Invalid region');

        const packageData = await this.prisma.package.findUnique({ where: { id: packageId }});
        if (!packageData) throw new BadRequestException('Invalid package');

        const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) throw new BadRequestException('User not found');

        return this.prisma.order.create({
            data: { userId, regionId, packageId, status: 'PENDING' },
        });
    }

    async getUserOrders(userId: string) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { region:true, package: true },
        });
    }

    async updateOrderStatus(orderId: string, status: string) {
        if (!(status in OrderStatus)) {
            throw new BadRequestException(`Invalid status: ${status}`);
        } 

        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: status as OrderStatus },
        });
    }
}
