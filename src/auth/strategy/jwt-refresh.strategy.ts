import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly logger = new Logger(JwtRefreshStrategy.name),
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.Refresh,
      ]),
      secretOrKey: config.get('JWT_REFRESH_SECRET'), // Use the secret key from your configuration
      passReqToCallBack: true,
    });
  }

  async validate(
    request: Request,
    payload: { sub: number; email: string },
  ): Promise<{
    refreshToken: string;
  }> {
    return this.authService.verifyUserRefreshToken(
      payload.sub,
      request.cookies?.Refresh,
    );
  }
}