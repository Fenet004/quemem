import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { PrismaService } from '../prisma/prisma.service';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [MinioModule],
  providers: [DocumentService, PrismaService],
  exports: [DocumentService],
})
export class DocumentModule {}
