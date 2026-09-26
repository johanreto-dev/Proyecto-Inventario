import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ConsumiblesService } from "./consumibles.service";
import { EntradaConsumibleDto } from "./dto/entrada-consumible.dto";
import { SalidaConsumibleDto } from "./dto/salida-consumible.dto";
import { EditarMovimientoConsumibleDto } from "./dto/editar-movimiento-consumible.dto";

@Controller("consumibles")
export class ConsumiblesController {
  constructor(private readonly consumiblesService: ConsumiblesService) {}

  @Post("entrada")
  entrada(@Body() dto: EntradaConsumibleDto) {
    return this.consumiblesService.registrarEntrada(dto);
  }

  @Post("salida")
  salida(@Body() dto: SalidaConsumibleDto) {
    return this.consumiblesService.registrarSalida(dto);
  }

  @Get("stock")
  stock() {
    return this.consumiblesService.obtenerStock();
  }

  @Patch("movimientos/:id")
  editarMovimiento(
    @Param("id") id: string,
    @Body() dto: EditarMovimientoConsumibleDto,
  ) {
    return this.consumiblesService.editarMovimiento(id, dto);
  }
  @Get("movimientos")
  movimientos() {
    return this.consumiblesService.listarMovimientos();
  }
}
