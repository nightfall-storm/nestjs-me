import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthDto, SignupAuthDto } from 'src/auth/dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
// import { RequestService } from 'src/request.service';

@Injectable()
export class AuthService {
  readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: AuthDto, res: Response) {
    // Retrieve user
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    // Check user hash
    const isPasswordValid = await argon.verify(user.hash, dto.password);
    if (!isPasswordValid) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.id, user.email, res);
  }

  async inscription(dto: SignupAuthDto) {
    // Hash password
    const hash = await argon.hash(dto.password);

    try {
      // Create the user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return user;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        // Check for unique constraint violation
        if (e.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw e;
    }
  }

  logout(res: Response) {
    res.cookie('Authentication', '', {
      httpOnly: true,
      secure: true,
      expires: new Date(0), // Expiry in the past
    });
    res.cookie('Refresh', '', {
      httpOnly: true,
      secure: true,
      expires: new Date(0), // Expiry in the past
    });

    return { message: 'Logged out successfully' };
  }

  async refreshToken(dto: AuthDto, res: Response) {
    // Retrieve user
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    // this.logger.log('Hello User ID:', this.reqService.getUserId());
    return this.signRefreshToken(user.id, user.email, res);
  }

  async updateUser(email: string, refreshToken: string) {
    const hashedToken = await argon.hash(refreshToken);
    const user = await this.prisma.user.update({
      where: { email },
      data: { refreshToken: hashedToken },
    });
    if (!user) throw new ForbiddenException('user not found');
  }

  async verifyUserRefreshToken(
    id: number,
    refreshToken: string,
  ): Promise<{
    refreshToken: string;
  }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          refreshToken: true,
        },
      });

      if (!user) throw new ForbiddenException('no user found');

      const isTokenValid = await argon.verify(user.refreshToken, refreshToken);
      if (!isTokenValid) throw new UnauthorizedException('invalid token');

      return user;
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  async signToken(
    userId: number,
    email: string,
    response?: Response,
  ): Promise<{ accessToken: string }> {
    const expiresIn = new Date(
      Date.now() +
        parseInt(
          this.config.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
        ),
    );
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');
    const accessToken = await this.jwt.signAsync(payload, {
      secret,
      expiresIn: '1h',
    });

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: true,
      expires: expiresIn,
    });
    // const accessRefreshToken = await this.signRefreshToken(
    //   userId,
    //   email,
    //   response,
    // );
    return { accessToken };
  }
  async signRefreshToken(
    userId: number,
    email: string,
    res: Response,
  ): Promise<{ accessRefreshToken: string }> {
    const refreshExpiresIn = new Date(
      Date.now() +
        parseInt(
          this.config.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
        ),
    );
    const payload = { sub: userId, email };

    const refreshSecret = this.config.get('JWT_REFRESH_SECRET');
    const accessRefreshToken = await this.jwt.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: '7d',
    });
    await this.updateUser(email, accessRefreshToken);

    res.cookie('Refresh', accessRefreshToken, {
      httpOnly: true,
      secure: true,
      expires: refreshExpiresIn,
    });
    return { accessRefreshToken };
  }
}
