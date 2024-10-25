import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { UserDto } from './dto';
import { ResponseWrapper } from 'src/common/filters/dto/response.wrapper';

@ApiTags('users')
@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard)  // Protect this route with the JWT guard
  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'User Authorized Successfully',
    type: ResponseWrapper,
  })
  async getMe(@GetUser() user: User): Promise<ResponseWrapper<UserDto>> {
    delete user.hash; // Remove sensitive data
    return new ResponseWrapper(true, user, 'User information retrieved successfully');
  }
}
