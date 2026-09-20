import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class EntradaEquipoDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  // Solo se usa si el Item tiene metodoSeguimiento = SERIE_MANUAL
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  numerosSerie?: string[];

  // Solo se usa si el Item tiene metodoSeguimiento = ID_AUTOMATICO
  @IsOptional()
  cantidad?: number;
}
