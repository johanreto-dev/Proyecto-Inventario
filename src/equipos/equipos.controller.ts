import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { EquiposService } from "./equipos.service";
import { EntradaEquipoDto } from "./dto/entrada-equipo.dto";
import { SalidaEquipoDto } from "./dto/salida-equipo.dto";
import { EditarMovimientoEquipoDto } from "./dto/editar-movimiento-equipo.dto";

@Controller("equipos")
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {}

  @Post("entrada")
  entrada(@Body() dto: EntradaEquipoDto) {
    return this.equiposService.registrarEntrada(dto);
  }

  @Post("salida")
  salida(@Body() dto: SalidaEquipoDto) {
    return this.equiposService.registrarSalida(dto);
  }

  @Get("resumen")
  resumen() {
    return this.equiposService.resumenPorModelo();
  }

  @Get(":itemId/unidades")
  unidades(@Param("itemId") itemId: string) {
    return this.equiposService.unidadesPorItem(itemId);
  }

  @Patch("movimientos/:id")
  editarMovimiento(
    @Param("id") id: string,
    @Body() dto: EditarMovimientoEquipoDto,
  ) {
    return this.equiposService.editarMovimiento(id, dto);
  }
}
