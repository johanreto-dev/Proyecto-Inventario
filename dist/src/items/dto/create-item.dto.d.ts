import { TipoItem, MetodoSeguimiento } from "@prisma/client";
export declare class CreateItemDto {
    categoria: string;
    marca: string;
    modelo: string;
    tipo: TipoItem;
    metodoSeguimiento?: MetodoSeguimiento;
}
