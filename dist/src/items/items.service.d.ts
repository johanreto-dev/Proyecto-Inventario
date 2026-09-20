import { PrismaService } from "../prisma/prisma.service";
import { CreateItemDto } from "./dto/create-item.dto";
export declare class ItemsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateItemDto): Promise<{
        categoria: string;
        marca: string;
        modelo: string;
        tipo: import("@prisma/client").$Enums.TipoItem;
        metodoSeguimiento: import("@prisma/client").$Enums.MetodoSeguimiento | null;
        id: string;
        nombre: string;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        categoria: string;
        marca: string;
        modelo: string;
        tipo: import("@prisma/client").$Enums.TipoItem;
        metodoSeguimiento: import("@prisma/client").$Enums.MetodoSeguimiento | null;
        id: string;
        nombre: string;
        createdAt: Date;
    }[]>;
}
