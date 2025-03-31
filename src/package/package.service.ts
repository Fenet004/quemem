import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PackageService {
    constructor(private prisma: PrismaService) {}

    async getPackagesByRegion(regionId: string) {
        return this.prisma.package.findMany({
            where: { regionId },
        });
    }

    async createPackage(name: string, price: number, features: string, regionId: string) {
        const regionExists = await this.prisma.region.findUnique({
            where: { id: regionId },
        })

        if (!regionExists) {
            throw new Error(`Region with ID ${regionId} does not exist`);
        }
        
        return this.prisma.package.create({
            data: { name, price, features, regionId },
        });
    }
}
