import { PrismaService } from "../prisma/prisma.service";
import { CreateItemDto } from "./dto/create-item.dto";
import { EditarItemDto } from "./dto/editar-item.dto";
export declare class ItemsService {
    private prisma;
    constructor(prisma: PrismaService);
    private buscarPorNombre;
    create(dto: CreateItemDto): Promise<{
        categoria: string;
        marca: string;
        modelo: string;
        tipo: import("@prisma/client").$Enums.TipoItem;
        metodoSeguimiento: import("@prisma/client").$Enums.MetodoSeguimiento | null;
        id: string;
        nombre: string;
        activo: boolean;
        createdAt: Date;
    }>;
    findAll(incluirInactivos?: boolean): Promise<{
        categoria: string;
        marca: string;
        modelo: string;
        tipo: import("@prisma/client").$Enums.TipoItem;
        metodoSeguimiento: import("@prisma/client").$Enums.MetodoSeguimiento | null;
        id: string;
        nombre: string;
        activo: boolean;
        createdAt: Date;
    }[]>;
    editar(id: string, dto: EditarItemDto): Promise<{
        categoria: string;
        marca: string;
        modelo: string;
        tipo: import("@prisma/client").$Enums.TipoItem;
        metodoSeguimiento: import("@prisma/client").$Enums.MetodoSeguimiento | null;
        id: string;
        nombre: string;
        activo: boolean;
        createdAt: Date;
    }>;
    cambiarActivo(id: string, activo: boolean): Promise<{
        categoria: string;
        marca: string;
        modelo: string;
        tipo: import("@prisma/client").$Enums.TipoItem;
        metodoSeguimiento: import("@prisma/client").$Enums.MetodoSeguimiento | null;
        id: string;
        nombre: string;
        activo: boolean;
        createdAt: Date;
    }>;
    eliminar(id: string): Promise<{
        categoria: string;
        marca: string;
        modelo: string;
        tipo: import("@prisma/client").$Enums.TipoItem;
        metodoSeguimiento: import("@prisma/client").$Enums.MetodoSeguimiento | null;
        id: string;
        nombre: string;
        activo: boolean;
        createdAt: Date;
    }>;
    fusionar(principalId: string, duplicadoId: string): Promise<{
        categoria: string;
        marca: string;
        modelo: string;
        tipo: import("@prisma/client").$Enums.TipoItem;
        metodoSeguimiento: import("@prisma/client").$Enums.MetodoSeguimiento | null;
        id: string;
        nombre: string;
        activo: boolean;
        createdAt: Date;
    }>;
}
