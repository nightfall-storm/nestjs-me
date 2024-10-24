import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard)  // Protect this route with the JWT guard
  @Get('me')
  getMe(@Req() req) {
    // `req.user` will contain the user object returned from the `JwtStrategy`
    return req.user;
  }
}
