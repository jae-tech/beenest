import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => this.transformResponse(data))
    );
  }

  private transformResponse(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'bigint') {
      return obj.toString();
    }

    if (obj && typeof obj.toNumber === 'function') {
      // Prisma Decimal 타입
      return obj.toNumber();
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.transformResponse(item));
    }

    if (typeof obj === 'object') {
      const transformed: any = {};
      for (const [key, value] of Object.entries(obj)) {
        transformed[key] = this.transformResponse(value);
      }
      return transformed;
    }

    return obj;
  }
}