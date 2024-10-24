import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService){}
    
    @Post('login')
    login(@Body() dto: AuthDto){
        return this.service.Login(dto);
    }

    @Post('inscription')
    Inscription(@Body() dto: AuthDto){
        return this.service.Inscription(dto);
    }
}
