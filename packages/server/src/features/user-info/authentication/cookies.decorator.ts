import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * Decorator to access cookies from the request object.
 * Taken from https://docs.nestjs.com/techniques/cookies#creating-a-custom-decorator-cross-platform
 */
export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);
