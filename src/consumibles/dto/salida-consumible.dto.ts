import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class SalidaConsumibleDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsInt()
  @IsPositive()
  cantidad: number;

  @IsOptional()
  @IsString()
  solicitante?: string;

  @IsOptional()
  @IsString()
  observacion?: string;
}
