import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ItemsModule } from "./items/items.module";
import { ConsumiblesModule } from "./consumibles/consumibles.module";
import { EquiposModule } from "./equipos/equipos.module";

@Module({
  imports: [PrismaModule, ItemsModule, ConsumiblesModule, EquiposModule],
})
export class AppModule {}
