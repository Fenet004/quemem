import { Controller, Get, UseGuards, Request, Param, Res, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import { MinioService } from '../minio/minio.service';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Controller('user')
export class UserController {
    constructor(
        private prisma: PrismaService,
        private minioService: MinioService,
    ) {}

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

    @UseGuards(JwtAuthGuard)
    @Get('orders/:id/download')
    async downloadUserDocument(
        @Param('id') orderId: string,
        @Request() req,
        @Res() res: Response,
    ) {
        const document = await this.prisma.document.findUnique({
            where: { orderId },
            include: { order: true },
        });
        
        if (!document) {
            throw new NotFoundException("Document not found");
        }

        if (document.order.userId !== req.user.userId) {
            throw new ForbiddenException('You are not allowed to access this document');
        }

        const command = new GetObjectCommand({
            Bucket: 'quemem-documents',
            Key: document.fileName,
        });

        const response = await this.minioService.getObject(command);
        const fileStream = response.Body as Readable;
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${document.fileName}"`,
        });
        fileStream.pipe(res);
    }
}
