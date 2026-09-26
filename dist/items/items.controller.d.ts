import { ItemsService } from "./items.service";
import { CreateItemDto } from "./dto/create-item.dto";
import { EditarItemDto } from "./dto/editar-item.dto";
import { FusionarItemsDto } from "./dto/fusionar-items.dto";
export declare class ItemsController {
    private readonly itemsService;
    constructor(itemsService: ItemsService);
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
    findAll(incluirInactivos?: string): Promise<{
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
    archivar(id: string): Promise<{
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
    reactivar(id: string): Promise<{
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
    fusionar(dto: FusionarItemsDto): Promise<{
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
