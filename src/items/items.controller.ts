import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ItemsService } from "./items.service";
import { CreateItemDto } from "./dto/create-item.dto";
import { EditarItemDto } from "./dto/editar-item.dto";
import { FusionarItemsDto } from "./dto/fusionar-items.dto";

@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto);
  }

  @Get()
  findAll(@Query("incluirInactivos") incluirInactivos?: string) {
    return this.itemsService.findAll(incluirInactivos === "true");
  }

  @Patch(":id")
  editar(@Param("id") id: string, @Body() dto: EditarItemDto) {
    return this.itemsService.editar(id, dto);
  }

  @Patch(":id/archivar")
  archivar(@Param("id") id: string) {
    return this.itemsService.cambiarActivo(id, false);
  }

  @Patch(":id/reactivar")
  reactivar(@Param("id") id: string) {
    return this.itemsService.cambiarActivo(id, true);
  }

  @Delete(":id")
  eliminar(@Param("id") id: string) {
    return this.itemsService.eliminar(id);
  }

  @Post("fusionar")
  fusionar(@Body() dto: FusionarItemsDto) {
    return this.itemsService.fusionar(dto.principalId, dto.duplicadoId);
  }
}
