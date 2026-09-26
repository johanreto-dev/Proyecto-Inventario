import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger("ExceptionFilter");

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] =
      "Ocurrió un error inesperado en el servidor";
    let error = "Internal Server Error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const respuesta = exception.getResponse();

      if (typeof respuesta === "string") {
        message = respuesta;
      } else if (typeof respuesta === "object" && respuesta !== null) {
        const cuerpo = respuesta as any;
        message = cuerpo.message ?? message;
        error = cuerpo.error ?? error;
      }
    } else if (exception instanceof Error) {
      // Error no controlado (ej. falla de conexión a la base de datos)
      // Lo registramos completo en la consola del servidor para depurarlo,
      // pero al cliente solo le damos un mensaje genérico, sin detalles internos.
      this.logger.error(exception.message, exception.stack);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
