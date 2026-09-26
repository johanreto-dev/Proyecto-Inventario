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
exports.ItemsController = void 0;
const common_1 = require("@nestjs/common");
const items_service_1 = require("./items.service");
const create_item_dto_1 = require("./dto/create-item.dto");
const editar_item_dto_1 = require("./dto/editar-item.dto");
const fusionar_items_dto_1 = require("./dto/fusionar-items.dto");
let ItemsController = class ItemsController {
    constructor(itemsService) {
        this.itemsService = itemsService;
    }
    create(dto) {
        return this.itemsService.create(dto);
    }
    findAll(incluirInactivos) {
        return this.itemsService.findAll(incluirInactivos === "true");
    }
    editar(id, dto) {
        return this.itemsService.editar(id, dto);
    }
    archivar(id) {
        return this.itemsService.cambiarActivo(id, false);
    }
    reactivar(id) {
        return this.itemsService.cambiarActivo(id, true);
    }
    eliminar(id) {
        return this.itemsService.eliminar(id);
    }
    fusionar(dto) {
        return this.itemsService.fusionar(dto.principalId, dto.duplicadoId);
    }
};
exports.ItemsController = ItemsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_item_dto_1.CreateItemDto]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("incluirInactivos")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, editar_item_dto_1.EditarItemDto]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "editar", null);
__decorate([
    (0, common_1.Patch)(":id/archivar"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "archivar", null);
__decorate([
    (0, common_1.Patch)(":id/reactivar"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "reactivar", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "eliminar", null);
__decorate([
    (0, common_1.Post)("fusionar"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fusionar_items_dto_1.FusionarItemsDto]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "fusionar", null);
exports.ItemsController = ItemsController = __decorate([
    (0, common_1.Controller)("items"),
    __metadata("design:paramtypes", [items_service_1.ItemsService])
], ItemsController);
//# sourceMappingURL=items.controller.js.map