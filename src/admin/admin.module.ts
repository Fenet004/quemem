import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { DocumentModule } from '../document/document.module'; 

@Module({
  imports: [AuthModule, DocumentModule],
  controllers: [AdminController],
  providers: [PrismaService],
})
export class AdminModule {}
