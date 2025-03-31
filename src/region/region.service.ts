import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegionService {
    constructor(private prisma: PrismaService) {}

    async getAllRegions() {
        return this.prisma.region.findMany({
            include: { packages: true },
        });
    }

    async createRegion(name: string) {
        return this.prisma.region.create({ data: { name } });
    }
}
