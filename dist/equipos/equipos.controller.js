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
exports.EquiposController = void 0;
const common_1 = require("@nestjs/common");
const equipos_service_1 = require("./equipos.service");
const entrada_equipo_dto_1 = require("./dto/entrada-equipo.dto");
const salida_equipo_dto_1 = require("./dto/salida-equipo.dto");
let EquiposController = class EquiposController {
    constructor(equiposService) {
        this.equiposService = equiposService;
    }
    entrada(dto) {
        return this.equiposService.registrarEntrada(dto);
    }
    salida(dto) {
        return this.equiposService.registrarSalida(dto);
    }
    resumen() {
        return this.equiposService.resumenPorModelo();
    }
    unidades(itemId) {
        return this.equiposService.unidadesPorItem(itemId);
    }
};
exports.EquiposController = EquiposController;
__decorate([
    (0, common_1.Post)("entrada"),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entrada_equipo_dto_1.EntradaEquipoDto]),
    __metadata("design:returntype", void 0)
], EquiposController.prototype, "entrada", null);
__decorate([
    (0, common_1.Post)("salida"),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [salida_equipo_dto_1.SalidaEquipoDto]),
    __metadata("design:returntype", void 0)
], EquiposController.prototype, "salida", null);
__decorate([
    (0, common_1.Get)("resumen"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EquiposController.prototype, "resumen", null);
__decorate([
    (0, common_1.Get)(":itemId/unidades"),
    __param(0, (0, common_1.Param)("itemId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EquiposController.prototype, "unidades", null);
exports.EquiposController = EquiposController = __decorate([
    (0, common_1.Controller)("equipos"),
    __metadata("design:paramtypes", [equipos_service_1.EquiposService])
], EquiposController);
//# sourceMappingURL=equipos.controller.js.map