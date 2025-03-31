import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    async sendPaymentConfirmation(to: string, subject: string, html: string) {
        await this.transporter.sendMail({
            from: `"Quemem Formation" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
    }
}
