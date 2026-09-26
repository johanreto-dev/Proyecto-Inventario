import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EstadoUnidad, TipoMovimiento } from "@prisma/client";
import { CrearEnsamblajeDto } from "./dto/crear-ensamblaje.dto";

@Injectable()
export class EnsamblajesService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CrearEnsamblajeDto) {
    const receta = await this.prisma.receta.findUnique({
      where: { id: dto.recetaId },
      include: { items: { include: { item: true } } },
    });
    if (!receta) {
      throw new NotFoundException("Receta no encontrada");
    }

    return this.prisma.$transaction(async (tx) => {
      const ticketConsumibles = [];
      const ticketEquipos = [];

      for (const ri of receta.items) {
        const requeridoTotal = ri.cantidadNecesaria * dto.cantidadArmada;

        if (ri.item.tipo === "CONSUMIBLE") {
          const totales = await tx.movimientoConsumible.groupBy({
            by: ["tipo"],
            where: { itemId: ri.itemId },
            _sum: { cantidad: true },
          });
          const entradas =
            totales.find((t) => t.tipo === "ENTRADA")?._sum.cantidad ?? 0;
          const salidas =
            totales.find((t) => t.tipo === "SALIDA")?._sum.cantidad ?? 0;
          const stockActual = entradas - salidas;

          if (stockActual < requeridoTotal) {
            throw new BadRequestException(
              `Stock insuficiente de "${ri.item.nombre}". Disponible: ${stockActual}, requerido: ${requeridoTotal}`,
            );
          }

          await tx.movimientoConsumible.create({
            data: {
              itemId: ri.itemId,
              cantidad: requeridoTotal,
              tipo: TipoMovimiento.SALIDA,
              solicitante: dto.destino,
              observacion:
                dto.observacion ?? `Ensamblaje de "${receta.nombre}"`,
            },
          });

          ticketConsumibles.push({
            nombre: ri.item.nombre,
            cantidad: requeridoTotal,
          });
        } else {
          // Lógica FIFO: tomamos las unidades DISPONIBLES más antiguas primero
          const unidadesDisponibles = await tx.unidadEquipo.findMany({
            where: { itemId: ri.itemId, estado: EstadoUnidad.DISPONIBLE },
            orderBy: { createdAt: "asc" },
            take: requeridoTotal,
          });

          if (unidadesDisponibles.length < requeridoTotal) {
            throw new BadRequestException(
              `Stock insuficiente de "${ri.item.nombre}". Disponible: ${unidadesDisponibles.length}, requerido: ${requeridoTotal}`,
            );
          }

          for (const unidad of unidadesDisponibles) {
            await tx.unidadEquipo.update({
              where: { id: unidad.id },
              data: { estado: EstadoUnidad.BAJA },
            });

            await tx.movimientoEquipo.create({
              data: {
                unidadEquipoId: unidad.id,
                tipo: TipoMovimiento.SALIDA,
                destino: dto.destino,
                observacion:
                  dto.observacion ?? `Ensamblaje de "${receta.nombre}"`,
              },
            });
          }

          ticketEquipos.push({
            nombre: ri.item.nombre,
            numerosSerie: unidadesDisponibles.map((u) => u.numeroSerie),
          });
        }
      }

      const ensamblaje = await tx.ensamblaje.create({
        data: {
          recetaId: dto.recetaId,
          cantidadArmada: dto.cantidadArmada,
          destino: dto.destino,
          observacion: dto.observacion,
        },
      });

      // Este objeto es el Ticket de Picking
      return {
        ensamblajeId: ensamblaje.id,
        receta: receta.nombre,
        cantidadArmada: dto.cantidadArmada,
        destino: dto.destino,
        observacion: dto.observacion,
        fecha: ensamblaje.fecha,
        consumibles: ticketConsumibles,
        equipos: ticketEquipos,
      };
    });
  }

  async listar() {
    return this.prisma.ensamblaje.findMany({
      include: { receta: true },
      orderBy: { fecha: "desc" },
    });
  }
}
