import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MailModule } from '../mail/mail.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports:[
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    MailModule,
  ],
  providers: [PaymentService,JwtAuthGuard,PrismaService],
  controllers: [PaymentController]
})
export class PaymentModule {}
