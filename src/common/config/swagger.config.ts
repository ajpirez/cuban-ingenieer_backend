import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configSwagger = (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setTitle('Cuban Ingenieer')
    .setDescription('Testing API description')
    .setVersion('1.0')
    .setExternalDoc('Postman Collection', '/api-json')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      filter: true,
    },
  });
};
