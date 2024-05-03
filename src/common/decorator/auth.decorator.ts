import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserOnJwt } from 'src/auth/types/user-jwt.type';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserOnJwt;
    return user;
  },
);
