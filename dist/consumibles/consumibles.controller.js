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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumiblesController = void 0;
const common_1 = require("@nestjs/common");
const consumibles_service_1 = require("./consumibles.service");
const entrada_consumible_dto_1 = require("./dto/entrada-consumible.dto");
const salida_consumible_dto_1 = require("./dto/salida-consumible.dto");
const editar_movimiento_consumible_dto_1 = require("./dto/editar-movimiento-consumible.dto");
let ConsumiblesController = class ConsumiblesController {
    constructor(consumiblesService) {
        this.consumiblesService = consumiblesService;
    }
    entrada(dto) {
        return this.consumiblesService.registrarEntrada(dto);
    }
    salida(dto) {
        return this.consumiblesService.registrarSalida(dto);
    }
    stock() {
        return this.consumiblesService.obtenerStock();
    }
    editarMovimiento(id, dto) {
        return this.consumiblesService.editarMovimiento(id, dto);
    }
    movimientos() {
        return this.consumiblesService.listarMovimientos();
    }
};
exports.ConsumiblesController = ConsumiblesController;
__decorate([
    (0, common_1.Post)("entrada"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entrada_consumible_dto_1.EntradaConsumibleDto]),
    __metadata("design:returntype", void 0)
], ConsumiblesController.prototype, "entrada", null);
__decorate([
    (0, common_1.Post)("salida"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [salida_consumible_dto_1.SalidaConsumibleDto]),
    __metadata("design:returntype", void 0)
], ConsumiblesController.prototype, "salida", null);
__decorate([
    (0, common_1.Get)("stock"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConsumiblesController.prototype, "stock", null);
__decorate([
    (0, common_1.Patch)("movimientos/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, editar_movimiento_consumible_dto_1.EditarMovimientoConsumibleDto]),
    __metadata("design:returntype", void 0)
], ConsumiblesController.prototype, "editarMovimiento", null);
__decorate([
    (0, common_1.Get)("movimientos"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConsumiblesController.prototype, "movimientos", null);
exports.ConsumiblesController = ConsumiblesController = __decorate([
    (0, common_1.Controller)("consumibles"),
    __metadata("design:paramtypes", [consumibles_service_1.ConsumiblesService])
], ConsumiblesController);
//# sourceMappingURL=consumibles.controller.js.map