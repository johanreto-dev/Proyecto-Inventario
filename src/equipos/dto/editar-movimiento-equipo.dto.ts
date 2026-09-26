import { IsOptional, IsString } from "class-validator";

export class EditarMovimientoEquipoDto {
  @IsOptional()
  @IsString()
  destino?: string;

  @IsOptional()
  @IsString()
  observacion?: string;
}
