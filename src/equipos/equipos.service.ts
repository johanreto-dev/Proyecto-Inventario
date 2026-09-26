import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  EstadoUnidad,
  MetodoSeguimiento,
  TipoMovimiento,
} from "@prisma/client";
import { EntradaEquipoDto } from "./dto/entrada-equipo.dto";
import { SalidaEquipoDto } from "./dto/salida-equipo.dto";
import { EditarMovimientoEquipoDto } from "./dto/editar-movimiento-equipo.dto";

@Injectable()
export class EquiposService {
  constructor(private prisma: PrismaService) {}

  private async siguienteCorrelativo(tx: any): Promise<string> {
    const contador = await tx.contadorEquipo.upsert({
      where: { id: 1 },
      update: { ultimoValor: { increment: 1 } },
      create: { id: 1, ultimoValor: 1 },
    });
    return `EQ-${String(contador.ultimoValor).padStart(3, "0")}`;
  }

  async registrarEntrada(dto: EntradaEquipoDto) {
    const item = await this.prisma.item.findUnique({
      where: { id: dto.itemId },
    });
    if (!item) {
      throw new NotFoundException("El ítem indicado no existe en el catálogo");
    }
    if (item.tipo !== "EQUIPO") {
      throw new BadRequestException(
        "Este ítem no está clasificado como Equipo",
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const unidadesCreadas = [];

      if (item.metodoSeguimiento === MetodoSeguimiento.SERIE_MANUAL) {
        if (!dto.numerosSerie || dto.numerosSerie.length === 0) {
          throw new BadRequestException(
            "Debe indicar al menos un número de serie",
          );
        }

        for (const numeroSerie of dto.numerosSerie) {
          const existente = await tx.unidadEquipo.findUnique({
            where: { numeroSerie },
          });
          if (existente) {
            throw new BadRequestException(
              `El número de serie "${numeroSerie}" ya existe`,
            );
          }

          const unidad = await tx.unidadEquipo.create({
            data: {
              itemId: dto.itemId,
              numeroSerie,
              estado: EstadoUnidad.DISPONIBLE,
            },
          });

          await tx.movimientoEquipo.create({
            data: { unidadEquipoId: unidad.id, tipo: TipoMovimiento.ENTRADA },
          });

          unidadesCreadas.push(unidad);
        }
      } else {
        const cantidad = dto.cantidad ?? 0;
        if (cantidad < 1) {
          throw new BadRequestException("Debe indicar una cantidad mayor a 0");
        }

        for (let i = 0; i < cantidad; i++) {
          const numeroSerie = await this.siguienteCorrelativo(tx);

          const unidad = await tx.unidadEquipo.create({
            data: {
              itemId: dto.itemId,
              numeroSerie,
              estado: EstadoUnidad.DISPONIBLE,
            },
          });

          await tx.movimientoEquipo.create({
            data: { unidadEquipoId: unidad.id, tipo: TipoMovimiento.ENTRADA },
          });

          unidadesCreadas.push(unidad);
        }
      }

      return unidadesCreadas;
    });
  }

  async registrarSalida(dto: SalidaEquipoDto) {
    return this.prisma.$transaction(async (tx) => {
      const resultados = [];

      for (const unidadEquipoId of dto.unidadesIds) {
        const unidad = await tx.unidadEquipo.findUnique({
          where: { id: unidadEquipoId },
        });

        if (!unidad) {
          throw new NotFoundException(`La unidad ${unidadEquipoId} no existe`);
        }
        if (unidad.estado === EstadoUnidad.BAJA) {
          throw new BadRequestException(
            `La unidad ${unidad.numeroSerie} ya está dada de baja`,
          );
        }

        await tx.unidadEquipo.update({
          where: { id: unidadEquipoId },
          data: { estado: EstadoUnidad.BAJA },
        });

        const movimiento = await tx.movimientoEquipo.create({
          data: {
            unidadEquipoId,
            tipo: TipoMovimiento.SALIDA,
            destino: dto.destino,
            observacion: dto.observacion,
          },
        });

        resultados.push(movimiento);
      }

      return resultados;
    });
  }

  async resumenPorModelo() {
    const items = await this.prisma.item.findMany({
      where: { tipo: "EQUIPO", activo: true },
      orderBy: { nombre: "asc" },
    });

    return Promise.all(
      items.map(async (item) => {
        const disponibles = await this.prisma.unidadEquipo.count({
          where: { itemId: item.id, estado: EstadoUnidad.DISPONIBLE },
        });
        return {
          itemId: item.id,
          nombre: item.nombre,
          metodoSeguimiento: item.metodoSeguimiento,
          disponibles,
        };
      }),
    );
  }

  async unidadesPorItem(itemId: string) {
    const item = await this.prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException("Ítem no encontrado");
    }

    const unidades = await this.prisma.unidadEquipo.findMany({
      where: { itemId },
      include: { movimientos: { orderBy: { fecha: "desc" } } },
      orderBy: { createdAt: "asc" },
    });

    return { item, unidades };
  }
  async editarMovimiento(id: string, dto: EditarMovimientoEquipoDto) {
    const movimiento = await this.prisma.movimientoEquipo.findUnique({
      where: { id },
    });
    if (!movimiento) {
      throw new NotFoundException("Movimiento no encontrado");
    }

    return this.prisma.movimientoEquipo.update({
      where: { id },
      data: {
        destino: dto.destino ?? movimiento.destino,
        observacion: dto.observacion ?? movimiento.observacion,
      },
    });
  }
}
