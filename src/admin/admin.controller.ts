import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UploadedFile, UseInterceptors, BadRequestException, Req, Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { OrderStatus } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { DocumentService } from '../document/document.service';
import { Response } from 'express';


@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
    constructor(
        private prisma: PrismaService,
        private documentService: DocumentService,
    ) {}

    @Get('orders')
    async getAllOrders(@Query('status') status?: string) {
        const whereClause = status
        ? {status: status.toUpperCase() as OrderStatus}
        : {};

        return this.prisma.order.findMany({
            where: whereClause,
            include: {
                user: true,
                region: true,
                package: true,
                payment: true,
            },
        });
    }

    @Post('regions')
    async createRegion(@Body() body: { name:string }) {
        return this.prisma.region.create({
            data: {
                name: body.name,
            },
        });
    }

    @Put('regions/:id')
    async updateRegion(@Param('id') id: string, @Body() body: { name: string }) {
        return this.prisma.region.update({
            where: { id },
            data: {
                name: body.name,
            },
        });
    }

    @Delete('regions/:id')
    async deleteRegion(@Param('id') id: string) {
        return this.prisma.region.delete({
            where: { id },
        });
    }

    @Post('packages')
    async createPackage(
        @Body()
        body: {
            name: string;
            price: number;
            features: string;
            regionId: string;
        },
    ) {
        return this.prisma.package.create({
            data: {
                name: body.name,
                price: body.price,
                features: body.features,
                regionId: body.regionId,
            },
        });
    }

    @Put('packages/:id')
    async updatePackage(
        @Param('id') id: string,
        @Body()
        body: {
            name?: string;
            price?: number;
            features?: string;
            regionId?: string;
        },
    ) {
        return this.prisma.package.update({
            where: { id },
            data: body,
        });
    }

    @Delete('packages/:id')
    async deletePackage(@Param('id') id: string) {
        return this.prisma.package.delete({
            where: { id },
        });
    }

    @Post('orders/:id/upload')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    async uploadDocument(
        @Param('id') orderId: string,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        
        if (!file) throw new BadRequestException('File is required');
        const userId = req.user?.userId;
        return this.documentService.upload(orderId, userId, file);
    }

    @Get('orders/:id/download')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async downloadDocument(
        @Param('id') orderId: string,
        @Res() res: Response,
    ) {
        const { stream, contentType } = await this.documentService.download(orderId);
        res.setHeader('Content-Type',contentType);
        stream.pipe(res);
        
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('documents')
    async getAllDocuments() {
        return this.documentService.getAllDocuments();
    }
}
