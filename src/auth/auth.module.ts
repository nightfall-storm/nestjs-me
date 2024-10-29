import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtRefreshAuthGuard } from './guard/jwt-refresh.guard';
import { JwtAuthGuard } from './guard';
// import { RequestService } from 'src/request.service';
// import { AuthenticationMiddleWare } from 'src/middlewares/authentication.middleware';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    JwtAuthGuard,
    JwtRefreshStrategy,
    JwtRefreshAuthGuard,
  ],
})
export class AuthModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthenticationMiddleWare)
  //     .forRoutes({ path: '/auth', method: RequestMethod.GET });
  // }
}
