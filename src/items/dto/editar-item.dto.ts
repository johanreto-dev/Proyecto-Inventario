import { IsOptional, IsString, IsNotEmpty } from "class-validator";

export class EditarItemDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoria?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  marca?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  modelo?: string;
}
