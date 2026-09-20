import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateItemDto } from "./dto/create-item.dto";

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateItemDto) {
    const nombre = `${dto.categoria} ${dto.marca} ${dto.modelo}`;

    const existente = await this.prisma.item.findUnique({ where: { nombre } });
    if (existente) {
      throw new ConflictException(
        `El ítem "${nombre}" ya existe en el catálogo`,
      );
    }

    return this.prisma.item.create({
      data: {
        categoria: dto.categoria,
        marca: dto.marca,
        modelo: dto.modelo,
        nombre,
        tipo: dto.tipo,
        metodoSeguimiento: dto.metodoSeguimiento,
      },
    });
  }

  async findAll() {
    return this.prisma.item.findMany({
      orderBy: { nombre: "asc" },
    });
  }
}
