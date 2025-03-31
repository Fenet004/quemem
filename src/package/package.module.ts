import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [PackageService],
  controllers: [PackageController]
})
export class PackageModule {}
