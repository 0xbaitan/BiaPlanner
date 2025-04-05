import { ExecutionContext, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.isPublic(context);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  private isPublic(context: ExecutionContext): boolean {
    const isPublic = Reflect.getMetadata('isPublic', context.getHandler());
    return isPublic;
  }
}
