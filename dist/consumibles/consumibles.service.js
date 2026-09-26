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
exports.ConsumiblesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ConsumiblesService = class ConsumiblesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async calcularStock(itemId) {
        const totales = await this.prisma.movimientoConsumible.groupBy({
            by: ["tipo"],
            where: { itemId },
            _sum: { cantidad: true },
        });
        const entradas = totales.find((t) => t.tipo === client_1.TipoMovimiento.ENTRADA)?._sum.cantidad ??
            0;
        const salidas = totales.find((t) => t.tipo === client_1.TipoMovimiento.SALIDA)?._sum.cantidad ?? 0;
        return entradas - salidas;
    }
    async registrarEntrada(dto) {
        const item = await this.prisma.item.findUnique({
            where: { id: dto.itemId },
        });
        if (!item) {
            throw new common_1.NotFoundException("El ítem indicado no existe en el catálogo");
        }
        return this.prisma.movimientoConsumible.create({
            data: {
                itemId: dto.itemId,
                cantidad: dto.cantidad,
                tipo: client_1.TipoMovimiento.ENTRADA,
            },
        });
    }
    async registrarSalida(dto) {
        const item = await this.prisma.item.findUnique({
            where: { id: dto.itemId },
        });
        if (!item) {
            throw new common_1.NotFoundException("El ítem indicado no existe en el catálogo");
        }
        return this.prisma.$transaction(async (tx) => {
            const totales = await tx.movimientoConsumible.groupBy({
                by: ["tipo"],
                where: { itemId: dto.itemId },
                _sum: { cantidad: true },
            });
            const entradas = totales.find((t) => t.tipo === client_1.TipoMovimiento.ENTRADA)?._sum.cantidad ??
                0;
            const salidas = totales.find((t) => t.tipo === client_1.TipoMovimiento.SALIDA)?._sum.cantidad ??
                0;
            const stockActual = entradas - salidas;
            if (dto.cantidad > stockActual) {
                throw new common_1.BadRequestException(`Stock insuficiente. Stock actual: ${stockActual}, se intentó retirar: ${dto.cantidad}`);
            }
            return tx.movimientoConsumible.create({
                data: {
                    itemId: dto.itemId,
                    cantidad: dto.cantidad,
                    tipo: client_1.TipoMovimiento.SALIDA,
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
        const stockPorItem = await Promise.all(items.map(async (item) => ({
            itemId: item.id,
            nombre: item.nombre,
            stock: await this.calcularStock(item.id),
        })));
        return stockPorItem;
    }
    async editarMovimiento(id, dto) {
        const movimiento = await this.prisma.movimientoConsumible.findUnique({
            where: { id },
        });
        if (!movimiento) {
            throw new common_1.NotFoundException("Movimiento no encontrado");
        }
        // Solo se permite corregir solicitante/observación — fecha y cantidad son inmutables
        return this.prisma.movimientoConsumible.update({
            where: { id },
            data: {
                solicitante: dto.solicitante ?? movimiento.solicitante,
                observacion: dto.observacion ?? movimiento.observacion,
            },
        });
    }
    async listarMovimientos() {
        return this.prisma.movimientoConsumible.findMany({
            include: { item: true },
            orderBy: { fecha: "desc" },
            take: 50,
        });
    }
};
exports.ConsumiblesService = ConsumiblesService;
exports.ConsumiblesService = ConsumiblesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConsumiblesService);
//# sourceMappingURL=consumibles.service.js.map