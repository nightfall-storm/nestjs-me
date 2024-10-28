import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthResponseDto } from './dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FreezePipe } from 'src/pipes/freeze.pipe';

@ApiTags('user authentication')
@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'User Login Authentication' })
    @ApiOkResponse({
        description: 'User Authorized Successfully',
        type: AuthResponseDto,
    })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided.' })  // Add this line
    @ApiBadRequestResponse({ description: 'Bad request, validation errors occurred.' })  // Add this line
    @ApiBody({ type: AuthDto }) 
    login(@Body(new FreezePipe()) dto: AuthDto) {
        return this.service.login(dto);
    }

    @Post('inscription')
    @ApiOperation({ summary: 'User SignUp Authentication' })
    @ApiCreatedResponse({ description: 'User Created Successfully' })
    @ApiBadRequestResponse({ description: 'Bad request, validation errors occurred.' })  // Add this line
    @ApiBody({ type: AuthDto }) 
    Inscription(@Body() dto: AuthDto) {
        return this.service.inscription(dto);
    }
}
