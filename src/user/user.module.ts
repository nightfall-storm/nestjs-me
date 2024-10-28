import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RequestService } from 'src/request.service';
import { AuthenticationMiddleware } from 'src/middlewares/authentication.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService, RequestService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes({path: '/users/me', method: RequestMethod.GET});
  }
}
