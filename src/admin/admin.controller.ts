import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UploadedFile, UseInterceptors, BadRequestException, Req, Res, NotFoundException, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { OrderStatus } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { DocumentService } from '../document/document.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { MinioService } from '../minio/minio.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
    constructor(
        private adminService: AdminService,
        private documentService: DocumentService,
        private prisma: PrismaService,
        private minioService: MinioService,
    ) {}

    @Get('orders')
    @ApiOperation({ summary: 'Get all orders (optionally filtered by status)' })
    @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
    @ApiResponse({ status: 200, description: 'List of orders returned successfully' })
    async getAllOrders(@Query('status') status?: string) {
        return this.adminService.getAllOrders(status);
    }

    @Post('regions')
    @ApiOperation({ summary: 'Create a new region' })
    @ApiBody({ schema: { example: { name: 'Addis Ababa' } } })
    @ApiResponse({ status: 201, description: 'Region created successfully' })
    async createRegion(@Body() body: { name:string }) {
        return this.adminService.createRegion(body.name);
    }

    @Put('regions/:id')
    @ApiOperation({ summary: 'Update a region by ID' })
    @ApiParam({ name: 'id' })
    @ApiBody({ schema: { example: { name: 'Updated Regon' } } })
    async updateRegion(@Param('id') id: string, @Body() body: { name: string }) {
        return this.adminService.updateRegion(id, body.name);
    }

    @Delete('regions/:id')
    @ApiOperation({ summary: 'Delete a region by ID' })
    @ApiParam({ name: 'id' })
    async deleteRegion(@Param('id') id: string) {
        return this.adminService.deleteRegion(id);
    }

    @Post('packages')
    @ApiOperation({ summary: 'Create a new package' })
    @ApiBody({ schema: { example: { name: 'Premium', price: 1000, features: 'Feature 1, Feature 2', regionId: 'region-id-uuid' } } })
    async createPackage(@Body() body: { name: string; price: number; features: string; regionId: string }) {
        return this.adminService.createPackage(body);
    }

    @Put('packages/:id')
    @ApiOperation({ summary: 'Update a package by ID' })
    @ApiParam({ name: 'id' })
    @ApiBody({ schema: { example: { name: 'Updated Package', price: 1200, features: 'Updated features', regionId: 'region-id-uuid' } } })
    async updatePackage(@Param('id') id: string, @Body() body: { name?: string; price?: number; features?: string; regionId?: string }) {
        return this.adminService.updatePackage(id, body);
    }

    @Delete('packages/:id')
    @ApiOperation({ summary: 'Delete a package by ID' })
    @ApiParam({ name: 'id' })
    async deletePackage(@Param('id') id: string) {
        return this.adminService.deletePackage(id);
    }

    @Post('orders/:id/upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload a document for an order' })
    @ApiParam({ name: 'id', description: 'Order ID' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
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
    @ApiOperation({ summary: 'Download a document for an order' })
    @ApiParam({ name: 'id', description: 'Order ID' })
    @ApiResponse({ status: 200, description: 'PDF document returned as a file stream' })
    async downloadDocument(
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

    @Get('documents')
    @ApiOperation({ summary: 'Get all uploaded documents' })
    async getAllDocuments() {
        return this.documentService.getAllDocuments();
    }
}
