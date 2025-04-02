import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email adress of the user' })
    email:string;

    @ApiProperty({ example: 'strongPassword123', description: 'Password for the account' })
    password:string;
}

export class LoginDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email address of the user' })
    email:string;

    @ApiProperty({ example: 'strongPassword123', description: 'Password for the account' })
    password:string;
}