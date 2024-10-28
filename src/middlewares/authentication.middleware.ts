import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestService } from 'src/request.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthenticationMiddleware.name);
  constructor(private readonly reqService: RequestService) {}
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(AuthenticationMiddleware.name);
    const userId: number = 123456;
    this.reqService.setUserId(userId);
    next();
  }
}
