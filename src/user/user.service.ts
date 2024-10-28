import { Injectable, Logger, Req, Res } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { RequestService } from 'src/request.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly reqService: RequestService) {}

  // async getUser(@Req() req: Request) {
  //   const user = req.user as User;
  //   this.logger.log('USER ID : ', this.reqService.getUserId());

  //   return user;
  // }
  
  async getUser(@GetUser() user: User) {
    this.logger.log('USER ID : ', this.reqService.getUserId());
    return user;
  }
}
