import { ConsumiblesService } from "./consumibles.service";
import { EntradaConsumibleDto } from "./dto/entrada-consumible.dto";
import { SalidaConsumibleDto } from "./dto/salida-consumible.dto";
export declare class ConsumiblesController {
    private readonly consumiblesService;
    constructor(consumiblesService: ConsumiblesService);
    entrada(dto: EntradaConsumibleDto): Promise<{
        id: string;
        cantidad: number;
        tipo: import("@prisma/client").$Enums.TipoMovimiento;
        fecha: Date;
        solicitante: string | null;
        observacion: string | null;
        itemId: string;
    }>;
    salida(dto: SalidaConsumibleDto): Promise<{
        id: string;
        cantidad: number;
        tipo: import("@prisma/client").$Enums.TipoMovimiento;
        fecha: Date;
        solicitante: string | null;
        observacion: string | null;
        itemId: string;
    }>;
    stock(): Promise<{
        itemId: string;
        nombre: string;
        stock: number;
    }[]>;
}
