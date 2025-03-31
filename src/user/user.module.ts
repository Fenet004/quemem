import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [AuthModule, MinioModule],
  controllers: [UserController],
  providers: [PrismaService],
})
export class UserModule {}
