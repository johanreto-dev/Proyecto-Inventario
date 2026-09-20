import { PrismaService } from "../prisma/prisma.service";
import { EntradaEquipoDto } from "./dto/entrada-equipo.dto";
import { SalidaEquipoDto } from "./dto/salida-equipo.dto";
export declare class EquiposService {
    private prisma;
    constructor(prisma: PrismaService);
    private siguienteCorrelativo;
    registrarEntrada(dto: EntradaEquipoDto): Promise<any[]>;
    registrarSalida(dto: SalidaEquipoDto): Promise<any[]>;
    resumenPorModelo(): Promise<{
        itemId: string;
        nombre: string;
        disponibles: number;
    }[]>;
    unidadesPorItem(itemId: string): Promise<({
        movimientos: {
            tipo: import("@prisma/client").$Enums.TipoMovimiento;
            id: string;
            observacion: string | null;
            fecha: Date;
            destino: string | null;
            unidadEquipoId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        itemId: string;
        numeroSerie: string;
        estado: import("@prisma/client").$Enums.EstadoUnidad;
    })[]>;
}
