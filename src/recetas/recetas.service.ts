import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CrearRecetaDto } from "./dto/crear-receta.dto";
import { ActualizarRecetaDto } from "./dto/actualizar-receta.dto";

@Injectable()
export class RecetasService {
  constructor(private prisma: PrismaService) {}

  private async validarItemsExisten(itemIds: string[]) {
    const items = await this.prisma.item.findMany({
      where: { id: { in: itemIds } },
    });
    if (items.length !== itemIds.length) {
      throw new BadRequestException(
        "Uno o más ítems de la receta no existen en el catálogo",
      );
    }
  }

  async crear(dto: CrearRecetaDto) {
    const itemIds = dto.items.map((i) => i.itemId);
    const idsUnicos = new Set(itemIds);
    if (idsUnicos.size !== itemIds.length) {
      throw new BadRequestException(
        "No puedes repetir el mismo ítem dos veces en la receta",
      );
    }
    await this.validarItemsExisten(itemIds);

    const existente = await this.prisma.receta.findUnique({
      where: { nombre: dto.nombre },
    });
    if (existente) {
      throw new BadRequestException(
        `Ya existe una receta llamada "${dto.nombre}"`,
      );
    }

    return this.prisma.receta.create({
      data: {
        nombre: dto.nombre,
        items: {
          create: dto.items.map((i) => ({
            itemId: i.itemId,
            cantidadNecesaria: i.cantidadNecesaria,
          })),
        },
      },
      include: { items: { include: { item: true } } },
    });
  }

  async listar(incluirInactivos = false) {
    return this.prisma.receta.findMany({
      where: incluirInactivos ? {} : { activo: true },
      include: { items: { include: { item: true } } },
      orderBy: { nombre: "asc" },
    });
  }

  async obtenerUna(id: string) {
    const receta = await this.prisma.receta.findUnique({
      where: { id },
      include: { items: { include: { item: true } } },
    });
    if (!receta) {
      throw new NotFoundException("Receta no encontrada");
    }
    return receta;
  }

  async actualizar(id: string, dto: ActualizarRecetaDto) {
    const receta = await this.prisma.receta.findUnique({ where: { id } });
    if (!receta) {
      throw new NotFoundException("Receta no encontrada");
    }

    const itemIds = dto.items.map((i) => i.itemId);
    const idsUnicos = new Set(itemIds);
    if (idsUnicos.size !== itemIds.length) {
      throw new BadRequestException(
        "No puedes repetir el mismo ítem dos veces en la receta",
      );
    }
    await this.validarItemsExisten(itemIds);

    return this.prisma.$transaction(async (tx) => {
      await tx.recetaItem.deleteMany({ where: { recetaId: id } });

      return tx.receta.update({
        where: { id },
        data: {
          nombre: dto.nombre,
          items: {
            create: dto.items.map((i) => ({
              itemId: i.itemId,
              cantidadNecesaria: i.cantidadNecesaria,
            })),
          },
        },
        include: { items: { include: { item: true } } },
      });
    });
  }

  async eliminar(id: string) {
    const receta = await this.prisma.receta.findUnique({ where: { id } });
    if (!receta) {
      throw new NotFoundException("Receta no encontrada");
    }

    const tieneEnsamblajes = await this.prisma.ensamblaje.count({
      where: { recetaId: id },
    });
    if (tieneEnsamblajes > 0) {
      throw new BadRequestException(
        `No se puede eliminar "${receta.nombre}" porque ya tiene ${tieneEnsamblajes} ensamblaje(s) registrado(s). Usa "Archivar" en su lugar.`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.recetaItem.deleteMany({ where: { recetaId: id } });
      return tx.receta.delete({ where: { id } });
    });
  }

  async cambiarActivo(id: string, activo: boolean) {
    const receta = await this.prisma.receta.findUnique({ where: { id } });
    if (!receta) {
      throw new NotFoundException("Receta no encontrada");
    }

    return this.prisma.receta.update({
      where: { id },
      data: { activo },
    });
  }

  async calcularViabilidad(id: string, cantidadDeseada: number) {
    const receta = await this.obtenerUna(id);
    const MARGEN_KITS = 2; // debajo de este margen, se considera "crítico" (amarillo)

    const itemsDetalle = await Promise.all(
      receta.items.map(async (ri) => {
        let stockDisponible: number;

        if (ri.item.tipo === "CONSUMIBLE") {
          const totales = await this.prisma.movimientoConsumible.groupBy({
            by: ["tipo"],
            where: { itemId: ri.itemId },
            _sum: { cantidad: true },
          });
          const entradas =
            totales.find((t) => t.tipo === "ENTRADA")?._sum.cantidad ?? 0;
          const salidas =
            totales.find((t) => t.tipo === "SALIDA")?._sum.cantidad ?? 0;
          stockDisponible = entradas - salidas;
        } else {
          stockDisponible = await this.prisma.unidadEquipo.count({
            where: { itemId: ri.itemId, estado: "DISPONIBLE" },
          });
        }

        const kitsPosiblesPieza = Math.floor(
          stockDisponible / ri.cantidadNecesaria,
        );

        let semaforo: "ROJO" | "AMARILLO" | "VERDE";
        if (kitsPosiblesPieza < cantidadDeseada) {
          semaforo = "ROJO";
        } else if (kitsPosiblesPieza - cantidadDeseada < MARGEN_KITS) {
          semaforo = "AMARILLO";
        } else {
          semaforo = "VERDE";
        }

        return {
          itemId: ri.itemId,
          nombre: ri.item.nombre,
          tipo: ri.item.tipo,
          cantidadNecesaria: ri.cantidadNecesaria,
          stockDisponible,
          kitsPosiblesPieza,
          semaforo,
        };
      }),
    );

    const maxKitsPosible = Math.min(
      ...itemsDetalle.map((i) => i.kitsPosiblesPieza),
    );

    return {
      recetaId: receta.id,
      nombre: receta.nombre,
      cantidadDeseada,
      maxKitsPosible,
      items: itemsDetalle,
    };
  }
}
