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
exports.ItemsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ItemsService = class ItemsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const nombre = `${dto.categoria} ${dto.marca} ${dto.modelo}`;
        const existente = await this.prisma.item.findUnique({ where: { nombre } });
        if (existente) {
            throw new common_1.ConflictException(`El ítem "${nombre}" ya existe en el catálogo`);
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
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ItemsService);
//# sourceMappingURL=items.service.js.map