import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    register(@Body() body: RegisterDto) {
        return this.authService.register(body.email, body.password);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Login successful and token returned' })
    login(@Body() body: LoginDto) {
        return this.authService.login(body.email, body.password);
    }
}
