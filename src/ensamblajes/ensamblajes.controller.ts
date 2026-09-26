import { Body, Controller, Get, Post } from "@nestjs/common";
import { EnsamblajesService } from "./ensamblajes.service";
import { CrearEnsamblajeDto } from "./dto/crear-ensamblaje.dto";

@Controller("ensamblajes")
export class EnsamblajesController {
  constructor(private readonly ensamblajesService: EnsamblajesService) {}

  @Post()
  crear(@Body() dto: CrearEnsamblajeDto) {
    return this.ensamblajesService.crear(dto);
  }

  @Get()
  listar() {
    return this.ensamblajesService.listar();
  }
}
