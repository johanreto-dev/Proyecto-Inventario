import { Body, Controller, Get, Post, ValidationPipe } from "@nestjs/common";
import { ConsumiblesService } from "./consumibles.service";
import { EntradaConsumibleDto } from "./dto/entrada-consumible.dto";
import { SalidaConsumibleDto } from "./dto/salida-consumible.dto";

@Controller("consumibles")
export class ConsumiblesController {
  constructor(private readonly consumiblesService: ConsumiblesService) {}

  @Post("entrada")
  entrada(@Body(ValidationPipe) dto: EntradaConsumibleDto) {
    return this.consumiblesService.registrarEntrada(dto);
  }

  @Post("salida")
  salida(@Body(ValidationPipe) dto: SalidaConsumibleDto) {
    return this.consumiblesService.registrarSalida(dto);
  }

  @Get("stock")
  stock() {
    return this.consumiblesService.obtenerStock();
  }
}
