import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator";

export class SalidaEquipoDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  unidadesIds: string[];

  @IsOptional()
  @IsString()
  destino?: string;

  @IsOptional()
  @IsString()
  observacion?: string;
}
