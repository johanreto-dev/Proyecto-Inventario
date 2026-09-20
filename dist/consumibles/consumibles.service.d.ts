import { PrismaService } from "../prisma/prisma.service";
import { EntradaConsumibleDto } from "./dto/entrada-consumible.dto";
import { SalidaConsumibleDto } from "./dto/salida-consumible.dto";
export declare class ConsumiblesService {
    private prisma;
    constructor(prisma: PrismaService);
    private calcularStock;
    registrarEntrada(dto: EntradaConsumibleDto): Promise<{
        id: string;
        cantidad: number;
        tipo: import("@prisma/client").$Enums.TipoMovimiento;
        fecha: Date;
        solicitante: string | null;
        observacion: string | null;
        itemId: string;
    }>;
    registrarSalida(dto: SalidaConsumibleDto): Promise<{
        id: string;
        cantidad: number;
        tipo: import("@prisma/client").$Enums.TipoMovimiento;
        fecha: Date;
        solicitante: string | null;
        observacion: string | null;
        itemId: string;
    }>;
    obtenerStock(): Promise<{
        itemId: string;
        nombre: string;
        stock: number;
    }[]>;
}
