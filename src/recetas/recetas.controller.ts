import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { RecetasService } from "./recetas.service";
import { CrearRecetaDto } from "./dto/crear-receta.dto";
import { ActualizarRecetaDto } from "./dto/actualizar-receta.dto";

@Controller("recetas")
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Post()
  crear(@Body() dto: CrearRecetaDto) {
    return this.recetasService.crear(dto);
  }

  @Get()
  listar(@Query("incluirInactivos") incluirInactivos?: string) {
    return this.recetasService.listar(incluirInactivos === "true");
  }

  @Get(":id")
  obtenerUna(@Param("id") id: string) {
    return this.recetasService.obtenerUna(id);
  }

  @Put(":id")
  actualizar(@Param("id") id: string, @Body() dto: ActualizarRecetaDto) {
    return this.recetasService.actualizar(id, dto);
  }

  @Delete(":id")
  eliminar(@Param("id") id: string) {
    return this.recetasService.eliminar(id);
  }

  @Patch(":id/archivar")
  archivar(@Param("id") id: string) {
    return this.recetasService.cambiarActivo(id, false);
  }

  @Patch(":id/reactivar")
  reactivar(@Param("id") id: string) {
    return this.recetasService.cambiarActivo(id, true);
  }

  @Get(":id/viabilidad")
  viabilidad(@Param("id") id: string, @Query("cantidad") cantidad?: string) {
    const cantidadDeseada = cantidad ? parseInt(cantidad, 10) : 1;
    return this.recetasService.calcularViabilidad(id, cantidadDeseada);
  }
}
