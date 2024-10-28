import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    // const response = ctx.switchToHttp().getResponse();
    // If `data` is provided (like 'id'), return only that property; otherwise, return the whole user object
    return data ? user?.[data] : user;
  },
);
