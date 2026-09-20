import { EquiposService } from "./equipos.service";
import { EntradaEquipoDto } from "./dto/entrada-equipo.dto";
import { SalidaEquipoDto } from "./dto/salida-equipo.dto";
export declare class EquiposController {
    private readonly equiposService;
    constructor(equiposService: EquiposService);
    entrada(dto: EntradaEquipoDto): Promise<any[]>;
    salida(dto: SalidaEquipoDto): Promise<any[]>;
    resumen(): Promise<{
        itemId: string;
        nombre: string;
        disponibles: number;
    }[]>;
    unidades(itemId: string): Promise<({
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
