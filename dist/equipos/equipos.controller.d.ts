import { EquiposService } from "./equipos.service";
import { EntradaEquipoDto } from "./dto/entrada-equipo.dto";
import { SalidaEquipoDto } from "./dto/salida-equipo.dto";
import { EditarMovimientoEquipoDto } from "./dto/editar-movimiento-equipo.dto";
export declare class EquiposController {
    private readonly equiposService;
    constructor(equiposService: EquiposService);
    entrada(dto: EntradaEquipoDto): Promise<any[]>;
    salida(dto: SalidaEquipoDto): Promise<any[]>;
    resumen(): Promise<{
        itemId: string;
        nombre: string;
        metodoSeguimiento: import("@prisma/client").$Enums.MetodoSeguimiento;
        disponibles: number;
    }[]>;
    unidades(itemId: string): Promise<{
        item: {
            id: string;
            categoria: string;
            marca: string;
            modelo: string;
            nombre: string;
            tipo: import("@prisma/client").$Enums.TipoItem;
            metodoSeguimiento: import("@prisma/client").$Enums.MetodoSeguimiento | null;
            activo: boolean;
            createdAt: Date;
        };
        unidades: ({
            movimientos: {
                id: string;
                tipo: import("@prisma/client").$Enums.TipoMovimiento;
                fecha: Date;
                unidadEquipoId: string;
                destino: string | null;
                observacion: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            itemId: string;
            numeroSerie: string;
            estado: import("@prisma/client").$Enums.EstadoUnidad;
        })[];
    }>;
    editarMovimiento(id: string, dto: EditarMovimientoEquipoDto): Promise<{
        id: string;
        tipo: import("@prisma/client").$Enums.TipoMovimiento;
        fecha: Date;
        unidadEquipoId: string;
        destino: string | null;
        observacion: string | null;
    }>;
}
