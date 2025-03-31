import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MinioService } from '../minio/minio.service';
import { PrismaService } from '../prisma/prisma.service';
import { GetObjectCommand } from '@aws-sdk/client-s3';


@Injectable()
export class DocumentService {
    constructor(
        private readonly minioService: MinioService,
        private readonly prisma: PrismaService,
    ) {}

    async upload(orderId: string, userId: string, file: Express.Multer.File) {
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }
        
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) throw new NotFoundException('Order not found');

        const fileUrl = await this.minioService.uploadFile(
            file.buffer,
            file.originalname,
            file.mimetype,
        );

        const document = await this.prisma.document.upsert({
            where: { orderId },
            update: {
                fileName: file.originalname,
                fileUrl: fileUrl,
                uploadedBy: {
                    connect: { id: userId },
                } ,
            },
            create: {
                fileName: file.originalname,
                fileUrl: fileUrl,
                uploadedBy: {
                    connect: {id: userId},
                },
                order: {
                    connect: { id: orderId },
                },
            },
        });

        return {
            message: 'File uploaded successfully',
            document,
        };
    }

    async download(orderId: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string}> {
        const document = await this.prisma.document.findUnique({
            where: { orderId },
        });

        if (!document) {
            throw new BadRequestException('Document not found');
        }

        const key =document.fileName;
        const bucket = process.env.MINIO_BUCKET_NAME!;

        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        const response = await this.minioService.getObject(command);
        return {
            stream: response.Body as NodeJS.ReadableStream,
            contentType: response.ContentType || 'application/octet=stream',
        }
    }

    async getAllDocuments() {
        return this.prisma.document.findMany({
            include: {
                order: true,
                uploadedBy: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                uploadedAt: 'desc',
            },
        });
    }
}
