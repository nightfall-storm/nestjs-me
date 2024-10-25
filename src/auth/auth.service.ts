import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthDto, SignupAuthDto } from 'src/auth/dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
        private jwt: JwtService
    ) { }

    async login(dto: AuthDto) {
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

        return this.signToken(user.id, user.email);
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
            return this.signToken(user.id, user.email);
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                // Check for unique constraint violation
                if (e.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw e; // Re-throw the error if it's not a known request error
        }
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = { sub: userId, email };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, { secret, expiresIn: '1h' });
        return { access_token: token };
    }
}
