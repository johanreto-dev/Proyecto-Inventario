import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ItemsModule } from "./items/items.module";
import { ConsumiblesModule } from "./consumibles/consumibles.module";
import { EquiposModule } from "./equipos/equipos.module";
import { RecetasModule } from "./recetas/recetas.module";
import { EnsamblajesModule } from "./ensamblajes/ensamblajes.module";

@Module({
  imports: [
    PrismaModule,
    ItemsModule,
    ConsumiblesModule,
    EquiposModule,
    RecetasModule,
    EnsamblajesModule,
  ],
})
export class AppModule {}
