import { ConsumiblesService } from "./consumibles.service";
import { EntradaConsumibleDto } from "./dto/entrada-consumible.dto";
import { SalidaConsumibleDto } from "./dto/salida-consumible.dto";
import { EditarMovimientoConsumibleDto } from "./dto/editar-movimiento-consumible.dto";
export declare class ConsumiblesController {
    private readonly consumiblesService;
    constructor(consumiblesService: ConsumiblesService);
    entrada(dto: EntradaConsumibleDto): Promise<{
        tipo: import("@prisma/client").$Enums.TipoMovimiento;
        id: string;
        cantidad: number;
        fecha: Date;
        solicitante: string | null;
        observacion: string | null;
        itemId: string;
    }>;
    salida(dto: SalidaConsumibleDto): Promise<{
        tipo: import("@prisma/client").$Enums.TipoMovimiento;
        id: string;
        cantidad: number;
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
    editarMovimiento(id: string, dto: EditarMovimientoConsumibleDto): Promise<{
        tipo: import("@prisma/client").$Enums.TipoMovimiento;
        id: string;
        cantidad: number;
        fecha: Date;
        solicitante: string | null;
        observacion: string | null;
        itemId: string;
    }>;
    movimientos(): Promise<({
        item: {
            categoria: string;
            marca: string;
            modelo: string;
            tipo: import("@prisma/client").$Enums.TipoItem;
            metodoSeguimiento: import("@prisma/client").$Enums.MetodoSeguimiento | null;
            id: string;
            nombre: string;
            activo: boolean;
            createdAt: Date;
        };
    } & {
        tipo: import("@prisma/client").$Enums.TipoMovimiento;
        id: string;
        cantidad: number;
        fecha: Date;
        solicitante: string | null;
        observacion: string | null;
        itemId: string;
    })[]>;
}
