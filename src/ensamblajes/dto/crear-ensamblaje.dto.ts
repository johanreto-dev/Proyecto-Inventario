import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class CrearEnsamblajeDto {
  @IsString()
  @IsNotEmpty()
  recetaId: string;

  @IsInt()
  @IsPositive()
  cantidadArmada: number;

  @IsOptional()
  @IsString()
  destino?: string;

  @IsOptional()
  @IsString()
  observacion?: string;
}
