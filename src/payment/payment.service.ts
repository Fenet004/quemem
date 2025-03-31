import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PaymentService {
    private stripe: Stripe;

    constructor(
        private prisma: PrismaService,
        private mailService: MailService,
    ) {
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeSecretKey) {
            throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
        }

        this.stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2023-10-16' as any,
        }); 
    }

    async createPayment(userId: string, orderId: string) {
        
        const existingPayment = await this.prisma.payment.findUnique({
            where: { orderId },
        });

        if (existingPayment) {
            throw new BadRequestException('Payment already exists for this order.');
        }

        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { package: true },
        })

        if (!order) throw new BadRequestException('Order not found');

        const price = order.package.price * 100;

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: price,
            currency: 'usd',
            payment_method_types:['card'],
            metadata: { orderId, userId },
        });

        await this.prisma.payment.create({
            data: {
                orderId,
                userId,
                stripePaymentId: paymentIntent.id,
                amount: order.package.price,
                status: 'PENDING',
            },
        });

        return { clientSecret: paymentIntent.client_secret };
    }

    async confirmPayment(stripePaymentId: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { stripePaymentId },
            include: {
              user: true,
              order: {
                include: {
                  region: true,
                  package: true,
                },
              },
            },
          });
          
        if (!payment) throw new BadRequestException('Payment not found');

        const userName = (payment.user as any).name || 'there';

        await this.mailService.sendPaymentConfirmation(
            payment.user.email,
            'Payment Confirmation - QuememFormation',
            `
              <h3>Hi ${userName},</h3>
              <p>Thank you for your payment for the <strong>${payment.order.package.name}</strong> package.</p>
              <p>Region: <strong>${payment.order.region.name}</strong></p>
              <p>Status: <strong>${payment.order.status}</strong></p>
              <br>
              <p>Regards,<br>QuememFormation Team</p>
            `,
          );
          

        const paymentIntent = await this.stripe.paymentIntents.retrieve(stripePaymentId);

        if (paymentIntent.status === 'succeeded') {
            await this.prisma.payment.update({
                where: { stripePaymentId },
                data: { status: 'COMPLETED' },
            });

            await this.prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'COMPLETED' },
            });

            return { message: 'Payment successful' };
        }

        

        throw new BadRequestException('Payment not completed');
    }
}
