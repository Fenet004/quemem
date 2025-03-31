import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async register(email: string, password: string) {
        const existingUser = await this.prisma.user.findUnique({ where: {email} });
        if (existingUser) throw new BadRequestException('User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: { email, password: hashedPassword },
        });

        return { message: 'User registered successfully' };
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new BadRequestException('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

        const token = this.jwtService.sign({ userId: user.id, role: user.role });
        return { token };
    }
}
