import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { RegionModule } from './region/region.module';
import { PackageModule } from './package/package.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { MinioModule } from './minio/minio.module';
import { DocumentModule } from './document/document.module';

@Module({
  imports: [AuthModule, PrismaModule, RegionModule, PackageModule, OrderModule, PaymentModule, UserModule, AdminModule, MailModule, MinioModule, DocumentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
