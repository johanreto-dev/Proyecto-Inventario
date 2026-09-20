import { Module } from "@nestjs/common";
import { ConsumiblesController } from "./consumibles.controller";
import { ConsumiblesService } from "./consumibles.service";

@Module({
  controllers: [ConsumiblesController],
  providers: [ConsumiblesService],
})
export class ConsumiblesModule {}
