"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquiposService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let EquiposService = class EquiposService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async siguienteCorrelativo(tx) {
        const contador = await tx.contadorEquipo.upsert({
            where: { id: 1 },
            update: { ultimoValor: { increment: 1 } },
            create: { id: 1, ultimoValor: 1 },
        });
        return `EQ-${String(contador.ultimoValor).padStart(3, "0")}`;
    }
    async registrarEntrada(dto) {
        const item = await this.prisma.item.findUnique({
            where: { id: dto.itemId },
        });
        if (!item) {
            throw new common_1.NotFoundException("El ítem indicado no existe en el catálogo");
        }
        if (item.tipo !== "EQUIPO") {
            throw new common_1.BadRequestException("Este ítem no está clasificado como Equipo");
        }
        return this.prisma.$transaction(async (tx) => {
            const unidadesCreadas = [];
            if (item.metodoSeguimiento === client_1.MetodoSeguimiento.SERIE_MANUAL) {
                if (!dto.numerosSerie || dto.numerosSerie.length === 0) {
                    throw new common_1.BadRequestException("Debe indicar al menos un número de serie");
                }
                for (const numeroSerie of dto.numerosSerie) {
                    const existente = await tx.unidadEquipo.findUnique({
                        where: { numeroSerie },
                    });
                    if (existente) {
                        throw new common_1.BadRequestException(`El número de serie "${numeroSerie}" ya existe`);
                    }
                    const unidad = await tx.unidadEquipo.create({
                        data: {
                            itemId: dto.itemId,
                            numeroSerie,
                            estado: client_1.EstadoUnidad.DISPONIBLE,
                        },
                    });
                    await tx.movimientoEquipo.create({
                        data: { unidadEquipoId: unidad.id, tipo: client_1.TipoMovimiento.ENTRADA },
                    });
                    unidadesCreadas.push(unidad);
                }
            }
            else {
                const cantidad = dto.cantidad ?? 0;
                if (cantidad < 1) {
                    throw new common_1.BadRequestException("Debe indicar una cantidad mayor a 0");
                }
                for (let i = 0; i < cantidad; i++) {
                    const numeroSerie = await this.siguienteCorrelativo(tx);
                    const unidad = await tx.unidadEquipo.create({
                        data: {
                            itemId: dto.itemId,
                            numeroSerie,
                            estado: client_1.EstadoUnidad.DISPONIBLE,
                        },
                    });
                    await tx.movimientoEquipo.create({
                        data: { unidadEquipoId: unidad.id, tipo: client_1.TipoMovimiento.ENTRADA },
                    });
                    unidadesCreadas.push(unidad);
                }
            }
            return unidadesCreadas;
        });
    }
    async registrarSalida(dto) {
        return this.prisma.$transaction(async (tx) => {
            const resultados = [];
            for (const unidadEquipoId of dto.unidadesIds) {
                const unidad = await tx.unidadEquipo.findUnique({
                    where: { id: unidadEquipoId },
                });
                if (!unidad) {
                    throw new common_1.NotFoundException(`La unidad ${unidadEquipoId} no existe`);
                }
                if (unidad.estado === client_1.EstadoUnidad.BAJA) {
                    throw new common_1.BadRequestException(`La unidad ${unidad.numeroSerie} ya está dada de baja`);
                }
                await tx.unidadEquipo.update({
                    where: { id: unidadEquipoId },
                    data: { estado: client_1.EstadoUnidad.BAJA },
                });
                const movimiento = await tx.movimientoEquipo.create({
                    data: {
                        unidadEquipoId,
                        tipo: client_1.TipoMovimiento.SALIDA,
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
        return Promise.all(items.map(async (item) => {
            const disponibles = await this.prisma.unidadEquipo.count({
                where: { itemId: item.id, estado: client_1.EstadoUnidad.DISPONIBLE },
            });
            return {
                itemId: item.id,
                nombre: item.nombre,
                metodoSeguimiento: item.metodoSeguimiento,
                disponibles,
            };
        }));
    }
    async unidadesPorItem(itemId) {
        const item = await this.prisma.item.findUnique({ where: { id: itemId } });
        if (!item) {
            throw new common_1.NotFoundException("Ítem no encontrado");
        }
        const unidades = await this.prisma.unidadEquipo.findMany({
            where: { itemId },
            include: { movimientos: { orderBy: { fecha: "desc" } } },
            orderBy: { createdAt: "asc" },
        });
        return { item, unidades };
    }
    async editarMovimiento(id, dto) {
        const movimiento = await this.prisma.movimientoEquipo.findUnique({
            where: { id },
        });
        if (!movimiento) {
            throw new common_1.NotFoundException("Movimiento no encontrado");
        }
        return this.prisma.movimientoEquipo.update({
            where: { id },
            data: {
                destino: dto.destino ?? movimiento.destino,
                observacion: dto.observacion ?? movimiento.observacion,
            },
        });
    }
};
exports.EquiposService = EquiposService;
exports.EquiposService = EquiposService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EquiposService);
//# sourceMappingURL=equipos.service.js.map