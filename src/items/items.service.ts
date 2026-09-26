import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateItemDto } from "./dto/create-item.dto";
import { EditarItemDto } from "./dto/editar-item.dto";

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  private async buscarPorNombre(nombre: string, excluirId?: string) {
    return this.prisma.item.findFirst({
      where: {
        nombre: { equals: nombre, mode: "insensitive" },
        ...(excluirId ? { NOT: { id: excluirId } } : {}),
      },
    });
  }

  async create(dto: CreateItemDto) {
    const categoria = dto.categoria.trim();
    const marca = dto.marca.trim();
    const modelo = dto.modelo.trim();
    const nombre = `${categoria} ${marca} ${modelo}`;

    const existente = await this.buscarPorNombre(nombre);
    if (existente) {
      throw new ConflictException(
        `El ítem "${existente.nombre}" ya existe en el catálogo`,
      );
    }

    return this.prisma.item.create({
      data: {
        categoria,
        marca,
        modelo,
        nombre,
        tipo: dto.tipo,
        metodoSeguimiento: dto.metodoSeguimiento,
      },
    });
  }

  async findAll(incluirInactivos = false) {
    return this.prisma.item.findMany({
      where: incluirInactivos ? {} : { activo: true },
      orderBy: { nombre: "asc" },
    });
  }

  async editar(id: string, dto: EditarItemDto) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException("Ítem no encontrado");
    }

    const categoria = dto.categoria?.trim() ?? item.categoria;
    const marca = dto.marca?.trim() ?? item.marca;
    const modelo = dto.modelo?.trim() ?? item.modelo;
    const nombre = `${categoria} ${marca} ${modelo}`;

    const duplicado = await this.buscarPorNombre(nombre, id);
    if (duplicado) {
      throw new ConflictException(
        `Ya existe otro ítem con el nombre "${duplicado.nombre}"`,
      );
    }

    return this.prisma.item.update({
      where: { id },
      data: { categoria, marca, modelo, nombre },
    });
  }

  async cambiarActivo(id: string, activo: boolean) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException("Ítem no encontrado");
    }

    return this.prisma.item.update({
      where: { id },
      data: { activo },
    });
  }

  async eliminar(id: string) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException("Ítem no encontrado");
    }

    const [movimientos, unidades, enRecetas] = await Promise.all([
      this.prisma.movimientoConsumible.count({ where: { itemId: id } }),
      this.prisma.unidadEquipo.count({ where: { itemId: id } }),
      this.prisma.recetaItem.count({ where: { itemId: id } }),
    ]);

    if (movimientos > 0 || unidades > 0) {
      throw new BadRequestException(
        `No se puede eliminar "${item.nombre}" porque ya tiene historial de movimientos. Usa "Archivar" en su lugar.`,
      );
    }
    if (enRecetas > 0) {
      throw new BadRequestException(
        `No se puede eliminar "${item.nombre}" porque está siendo usado en ${enRecetas} receta(s). Quítalo de esas recetas primero, o archívalo.`,
      );
    }

    return this.prisma.item.delete({ where: { id } });
  }

  async fusionar(principalId: string, duplicadoId: string) {
    if (principalId === duplicadoId) {
      throw new BadRequestException(
        "Selecciona dos ítems distintos para fusionar",
      );
    }

    const [principal, duplicado] = await Promise.all([
      this.prisma.item.findUnique({ where: { id: principalId } }),
      this.prisma.item.findUnique({ where: { id: duplicadoId } }),
    ]);

    if (!principal || !duplicado) {
      throw new NotFoundException(
        "Alguno de los ítems seleccionados no existe",
      );
    }
    if (principal.tipo !== duplicado.tipo) {
      throw new BadRequestException(
        "Solo puedes fusionar ítems del mismo tipo (Consumible con Consumible, Equipo con Equipo)",
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.movimientoConsumible.updateMany({
        where: { itemId: duplicadoId },
        data: { itemId: principalId },
      });

      await tx.unidadEquipo.updateMany({
        where: { itemId: duplicadoId },
        data: { itemId: principalId },
      });

      const recetaItemsDuplicado = await tx.recetaItem.findMany({
        where: { itemId: duplicadoId },
      });
      for (const ri of recetaItemsDuplicado) {
        const yaExiste = await tx.recetaItem.findUnique({
          where: {
            recetaId_itemId: { recetaId: ri.recetaId, itemId: principalId },
          },
        });
        if (yaExiste) {
          await tx.recetaItem.update({
            where: { id: yaExiste.id },
            data: {
              cantidadNecesaria:
                yaExiste.cantidadNecesaria + ri.cantidadNecesaria,
            },
          });
          await tx.recetaItem.delete({ where: { id: ri.id } });
        } else {
          await tx.recetaItem.update({
            where: { id: ri.id },
            data: { itemId: principalId },
          });
        }
      }

      await tx.item.delete({ where: { id: duplicadoId } });

      return tx.item.findUnique({ where: { id: principalId } });
    });
  }
}
