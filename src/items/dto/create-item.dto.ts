import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TipoItem, MetodoSeguimiento } from "@prisma/client";

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsString()
  @IsNotEmpty()
  marca: string;

  @IsString()
  @IsNotEmpty()
  modelo: string;

  @IsEnum(TipoItem)
  tipo: TipoItem;

  @IsOptional()
  @IsEnum(MetodoSeguimiento)
  metodoSeguimiento?: MetodoSeguimiento;
}
