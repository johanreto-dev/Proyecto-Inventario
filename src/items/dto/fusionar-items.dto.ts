import { IsNotEmpty, IsString } from "class-validator";

export class FusionarItemsDto {
  @IsString()
  @IsNotEmpty()
  principalId: string;

  @IsString()
  @IsNotEmpty()
  duplicadoId: string;
}
