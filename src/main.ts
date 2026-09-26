import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle("Sistema de Inventario API")
    .setDescription(
      "Endpoints del sistema de gestión de inventario, kits y ensamblaje",
    )
    .setVersion("1.0")
    .build();
  const documento = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, documento);

  await app.listen(3000);
  console.log("Servidor corriendo en http://localhost:3000");
  console.log("Documentación disponible en http://localhost:3000/api/docs");
}
bootstrap();
