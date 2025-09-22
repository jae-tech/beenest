import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const { status, error } = this.getStatusAndError(exception);

    // 로그 기록
    this.logger.error(
      `HTTP Exception: ${request.method} ${request.url}`,
      {
        status,
        error,
        stack: exception instanceof Error ? exception.stack : undefined,
      },
    );

    // 표준 에러 응답 형식으로 반환
    response.status(status).send({ error });
  }

  private getStatusAndError(exception: unknown): { status: number; error: ApiError } {
    // HTTP Exception 처리
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      return {
        status,
        error: {
          code: this.getErrorCode(status),
          message: typeof response === 'string' ? response : (response as any).message || exception.message,
          details: typeof response === 'object' ? (response as any).details : undefined,
        },
      };
    }

    // Prisma 에러 처리
    if (exception instanceof PrismaClientKnownRequestError) {
      return this.handlePrismaError(exception);
    }

    // 일반 에러 처리
    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: {
          code: 'INTERNAL_SERVER_ERROR_500',
          message: process.env.NODE_ENV === 'production' ? '서버 내부 오류가 발생했습니다' : exception.message,
          details: process.env.NODE_ENV === 'production' ? undefined : exception.stack,
        },
      };
    }

    // 알 수 없는 에러
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: {
        code: 'UNKNOWN_ERROR_500',
        message: '알 수 없는 오류가 발생했습니다',
      },
    };
  }

  private getErrorCode(status: number): string {
    const errorCodeMap: Record<number, string> = {
      400: 'BAD_REQUEST_400',
      401: 'UNAUTHORIZED_401',
      403: 'FORBIDDEN_403',
      404: 'NOT_FOUND_404',
      409: 'CONFLICT_409',
      422: 'UNPROCESSABLE_ENTITY_422',
      429: 'TOO_MANY_REQUESTS_429',
      500: 'INTERNAL_SERVER_ERROR_500',
      502: 'BAD_GATEWAY_502',
      503: 'SERVICE_UNAVAILABLE_503',
    };

    return errorCodeMap[status] || `HTTP_ERROR_${status}`;
  }

  private handlePrismaError(error: PrismaClientKnownRequestError): { status: number; error: ApiError } {
    switch (error.code) {
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          error: {
            code: 'DUPLICATE_ENTRY_409',
            message: '이미 존재하는 데이터입니다',
            details: `중복된 필드: ${error.meta?.target}`,
          },
        };

      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          error: {
            code: 'RECORD_NOT_FOUND_404',
            message: '요청한 데이터를 찾을 수 없습니다',
          },
        };

      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          error: {
            code: 'FOREIGN_KEY_CONSTRAINT_400',
            message: '참조 무결성 위반: 연관된 데이터를 확인해주세요',
            details: error.meta?.field_name as string,
          },
        };

      case 'P2014':
        return {
          status: HttpStatus.BAD_REQUEST,
          error: {
            code: 'RELATION_VIOLATION_400',
            message: '관련 데이터가 존재하여 삭제할 수 없습니다',
          },
        };

      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: {
            code: 'DATABASE_ERROR_500',
            message: '데이터베이스 오류가 발생했습니다',
            details: process.env.NODE_ENV === 'production' ? undefined : error.message,
          },
        };
    }
  }
}