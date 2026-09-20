import { PrismaService } from "../prisma/prisma.service";
import { EntradaConsumibleDto } from "./dto/entrada-consumible.dto";
import { SalidaConsumibleDto } from "./dto/salida-consumible.dto";
export declare class ConsumiblesService {
    private prisma;
    constructor(prisma: PrismaService);
    private calcularStock;
    registrarEntrada(dto: EntradaConsumibleDto): Promise<{
        tipo: import("@prisma/client").$Enums.TipoMovimiento;
        id: string;
        itemId: string;
        cantidad: number;
        solicitante: string | null;
        observacion: string | null;
        fecha: Date;
    }>;
    registrarSalida(dto: SalidaConsumibleDto): Promise<{
        tipo: import("@prisma/client").$Enums.TipoMovimiento;
        id: string;
        itemId: string;
        cantidad: number;
        solicitante: string | null;
        observacion: string | null;
        fecha: Date;
    }>;
    obtenerStock(): Promise<{
        itemId: string;
        nombre: string;
        stock: number;
    }[]>;
}
