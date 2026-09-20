import { Body, Controller, Get, Post, ValidationPipe } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { CreateItemDto } from "./dto/create-item.dto";

@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body(ValidationPipe) dto: CreateItemDto) {
    return this.itemsService.create(dto);
  }

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }
}
