import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { DocumentModule } from '../document/document.module'; 
import { AdminService } from './admin.service';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [AuthModule, DocumentModule, MinioModule],
  controllers: [AdminController],
  providers: [PrismaService, AdminService],
})
export class AdminModule {}
