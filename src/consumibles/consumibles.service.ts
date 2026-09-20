import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TipoMovimiento } from "@prisma/client";
import { EntradaConsumibleDto } from "./dto/entrada-consumible.dto";
import { SalidaConsumibleDto } from "./dto/salida-consumible.dto";

@Injectable()
export class ConsumiblesService {
  constructor(private prisma: PrismaService) {}

  private async calcularStock(itemId: string): Promise<number> {
    const totales = await this.prisma.movimientoConsumible.groupBy({
      by: ["tipo"],
      where: { itemId },
      _sum: { cantidad: true },
    });

    const entradas =
      totales.find((t) => t.tipo === TipoMovimiento.ENTRADA)?._sum.cantidad ??
      0;
    const salidas =
      totales.find((t) => t.tipo === TipoMovimiento.SALIDA)?._sum.cantidad ?? 0;

    return entradas - salidas;
  }

  async registrarEntrada(dto: EntradaConsumibleDto) {
    const item = await this.prisma.item.findUnique({
      where: { id: dto.itemId },
    });
    if (!item) {
      throw new NotFoundException("El ítem indicado no existe en el catálogo");
    }

    return this.prisma.movimientoConsumible.create({
      data: {
        itemId: dto.itemId,
        cantidad: dto.cantidad,
        tipo: TipoMovimiento.ENTRADA,
      },
    });
  }

  async registrarSalida(dto: SalidaConsumibleDto) {
    const item = await this.prisma.item.findUnique({
      where: { id: dto.itemId },
    });
    if (!item) {
      throw new NotFoundException("El ítem indicado no existe en el catálogo");
    }

    return this.prisma.$transaction(async (tx) => {
      const totales = await tx.movimientoConsumible.groupBy({
        by: ["tipo"],
        where: { itemId: dto.itemId },
        _sum: { cantidad: true },
      });

      const entradas =
        totales.find((t) => t.tipo === TipoMovimiento.ENTRADA)?._sum.cantidad ??
        0;
      const salidas =
        totales.find((t) => t.tipo === TipoMovimiento.SALIDA)?._sum.cantidad ??
        0;
      const stockActual = entradas - salidas;

      if (dto.cantidad > stockActual) {
        throw new BadRequestException(
          `Stock insuficiente. Stock actual: ${stockActual}, se intentó retirar: ${dto.cantidad}`,
        );
      }

      return tx.movimientoConsumible.create({
        data: {
          itemId: dto.itemId,
          cantidad: dto.cantidad,
          tipo: TipoMovimiento.SALIDA,
          solicitante: dto.solicitante,
          observacion: dto.observacion,
        },
      });
    });
  }

  async obtenerStock() {
    const items = await this.prisma.item.findMany({
      where: { tipo: "CONSUMIBLE" },
      orderBy: { nombre: "asc" },
    });

    const stockPorItem = await Promise.all(
      items.map(async (item) => ({
        itemId: item.id,
        nombre: item.nombre,
        stock: await this.calcularStock(item.id),
      })),
    );

    return stockPorItem;
  }
}
