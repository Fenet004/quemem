import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() body: RegisterDto) {
        return this.authService.register(body.email, body.password);
    }

    @Post('login')
    login(@Body() body: LoginDto) {
        return this.authService.login(body.email, body.password);
    }
}
