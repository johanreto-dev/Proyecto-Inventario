import { IsOptional, IsString } from "class-validator";

export class EditarMovimientoConsumibleDto {
  @IsOptional()
  @IsString()
  solicitante?: string;

  @IsOptional()
  @IsString()
  observacion?: string;
}
