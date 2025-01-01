import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class CreatedByInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assumes authenticated user from passport/jwt

    const dto = request.body;

    if (Array.isArray(dto)) {
      dto.forEach((item) => {
        if (Object.keys(item).includes('createdById') && !item.createdById) {
          item.createdById = user.id;
        }
      });
    } else if (Object.keys(dto).includes('createdById') && !dto.createdById) {
      dto.createdById = user.id;
    } else {
      dto.createdById = null;
    }

    return next.handle();
  }
}
