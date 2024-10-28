import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/authentication.guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly service: UserService) {}
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // Protect this route with the JWT guard
  @Get('me')
  async getUser(@GetUser() user: User) {
    return this.service.getUser(user);
  }

  // async getUser(@Req() req: Request) {
  //   return this.service.getUser(req);
  // }
}
