import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthResponseDto } from './dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from './guard';
import { JwtRefreshAuthGuard } from './guard/jwt-refresh.guard';

@ApiTags('user authentication')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User Login Authentication' })
  @ApiOkResponse({
    description: 'User Authorized Successfully',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials provided.' }) // Add this line
  @ApiBadRequestResponse({
    description: 'Bad request, validation errors occurred.',
  }) // Add this line
  @ApiBody({ type: AuthDto })
  async login(@Body() dto: AuthDto, @Res() res: Response) {
    try {
      const result = await this.service.login(dto, res);
      return res.status(200).json(result); // Explicitly send the response here
    } catch (error) {
      this.service.logger.error('Error during login', error); // Log error for debugging
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' }); // Handle error response
    }
  }

  @Post('inscription')
  @ApiOperation({ summary: 'User SignUp Authentication' })
  @ApiCreatedResponse({ description: 'User Created Successfully' })
  @ApiBadRequestResponse({
    description: 'Bad request, validation errors occurred.',
  }) // Add this line
  @ApiBody({ type: AuthDto })
  Inscription(@Body() dto: AuthDto) {
    return this.service.inscription(dto);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    this.service.logout(res);
    return res
      .status(200)
      .json({ success: true, message: 'Cookies cleared successfully' });
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiBody({ type: AuthDto })
  @ApiCookieAuth('Authentication')
  async refresh(@Body() dto: AuthDto, @Res() res: Response) {
    try {
      const result = await this.service.refreshToken(dto, res);
      return res.status(200).json(result); // Explicitly send the response here
    } catch (error) {
      this.service.logger.error('Error during login', error); // Log error for debugging
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' }); // Handle error response
    }
  }
}
