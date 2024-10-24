import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private prisma: PrismaService, private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extract the JWT from the request header
            secretOrKey: config.get('JWT_SECRET'),  // Use the secret key from your configuration
        });
    }

    async validate(payload: { sub: number, email: string }) {
        const user = this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            }
        });
        if(!user){
            throw new UnauthorizedException();
        }

        return user;
    }

}