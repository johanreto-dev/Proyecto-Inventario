import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class EntradaConsumibleDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsInt()
  @IsPositive()
  cantidad: number;
}
