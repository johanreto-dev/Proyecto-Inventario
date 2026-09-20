import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from "@nestjs/common";
import { EquiposService } from "./equipos.service";
import { EntradaEquipoDto } from "./dto/entrada-equipo.dto";
import { SalidaEquipoDto } from "./dto/salida-equipo.dto";

@Controller("equipos")
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {}

  @Post("entrada")
  entrada(@Body(ValidationPipe) dto: EntradaEquipoDto) {
    return this.equiposService.registrarEntrada(dto);
  }

  @Post("salida")
  salida(@Body(ValidationPipe) dto: SalidaEquipoDto) {
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
}
