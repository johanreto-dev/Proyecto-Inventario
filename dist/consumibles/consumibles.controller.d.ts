import { ConsumiblesService } from "./consumibles.service";
import { EntradaConsumibleDto } from "./dto/entrada-consumible.dto";
import { SalidaConsumibleDto } from "./dto/salida-consumible.dto";
export declare class ConsumiblesController {
    private readonly consumiblesService;
    constructor(consumiblesService: ConsumiblesService);
    entrada(dto: EntradaConsumibleDto): Promise<{
        tipo: import("@prisma/client").$Enums.TipoMovimiento;
        id: string;
        itemId: string;
        cantidad: number;
        solicitante: string | null;
        observacion: string | null;
        fecha: Date;
    }>;
    salida(dto: SalidaConsumibleDto): Promise<{
        tipo: import("@prisma/client").$Enums.TipoMovimiento;
        id: string;
        itemId: string;
        cantidad: number;
        solicitante: string | null;
        observacion: string | null;
        fecha: Date;
    }>;
    stock(): Promise<{
        itemId: string;
        nombre: string;
        stock: number;
    }[]>;
}
