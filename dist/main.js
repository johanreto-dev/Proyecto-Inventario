"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Sistema de Inventario API")
        .setDescription("Endpoints del sistema de gestión de inventario, kits y ensamblaje")
        .setVersion("1.0")
        .build();
    const documento = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api/docs", app, documento);
    await app.listen(3000);
    console.log("Servidor corriendo en http://localhost:3000");
    console.log("Documentación disponible en http://localhost:3000/api/docs");
}
bootstrap();
//# sourceMappingURL=main.js.map