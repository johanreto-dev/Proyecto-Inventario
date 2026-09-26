import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class RecetaItemDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsInt()
  @IsPositive()
  cantidadNecesaria: number;
}

export class CrearRecetaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RecetaItemDto)
  items: RecetaItemDto[];
}
