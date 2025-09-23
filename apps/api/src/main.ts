import 'tsconfig-paths/register';

// BigInt 직렬화 지원 추가
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // 전역 Exception Filter 설정
  app.useGlobalFilters(new HttpExceptionFilter());

  // 전역 응답 변환 인터셉터 설정 (BigInt 처리)
  app.useGlobalInterceptors(new TransformInterceptor());

  // 전역 검증 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS 설정
  await app.register(require('@fastify/cors'), {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // Swagger 문서 설정
  const config = new DocumentBuilder()
    .setTitle('Beenest API')
    .setDescription('거래처 및 재고 관리 시스템 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Beenest API 서버가 포트 ${port}에서 실행 중입니다`);
  console.log(`📚 API 문서: http://localhost:${port}/docs`);
}

bootstrap();

// Hot Module Replacement
declare const module: any;

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => console.log('Disposing app...'));
}
