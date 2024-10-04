import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './auth/auth.filter';
import * as SuperTokensConfig from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port =
    process.env.REACT_APP_API_PORT || process.env.VITE_API_PORT || 3001;
  app.enableCors({
    origin: [SuperTokensConfig.appInfo.websiteDomain],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });
  app.useGlobalFilters(new SupertokensExceptionFilter());
  await app.listen(port);
}
bootstrap();
