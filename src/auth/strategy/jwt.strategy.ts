import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.Authentication,
      ]),
      secretOrKey: config.get('JWT_SECRET'), // Use the secret key from your configuration
    });
  }
  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        email: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  //   constructor(
  //     private readonly prisma: PrismaService,
  //     private readonly config: ConfigService,
  //   ) {
  //     super({
  //       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract the JWT from the request header
  //       secretOrKey: config.get('JWT_SECRET'), // Use the secret key from your configuration
  //     });
  //   }

  //   async validate(payload: { sub: number; email: string }) {
  //     const user = await this.prisma.user.findUnique({
  //       where: {
  //         id: payload.sub,
  //       },
  //       select: {
  //         id: true,
  //         email: true,
  //         updatedAt: true,
  //         createdAt: true,
  //         firstName: true,
  //         lastName: true,
  //       },
  //     });
  //     if (!user) {
  //       throw new UnauthorizedException();
  //     }

  //     return user;
  //   }
}
