import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    getAllOrders(status?: string) {
        const whereClause = status ? { status: status.toUpperCase() as OrderStatus } : {};
        return this.prisma.order.findMany({
            where: whereClause,
            include: { user: true, region: true, package: true, payment: true},
        });
    }

    createRegion(name: string) {
        return this.prisma.region.create({ data: { name } });
    }

    updateRegion(id: string, name: string) {
        return this.prisma.region.update({ where: { id }, data: { name } });
    }

    deleteRegion(id: string) {
        return this.prisma.region.delete({ where: { id } });
    }

    createPackage(data: { name: string; price: number; features: string; regionId: string }) {
        return this.prisma.package.create({ data });
    }

    updatePackage(id: string, data: { name?: string; price?:number; features?: string; regionId?: string}) {
        return this.prisma.package.update({ where: { id }, data });
    }

    deletePackage(id:string) {
        return this.prisma.package.delete({ where: { id } });
    }
}
