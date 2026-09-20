import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ItemsModule } from "./items/items.module";
import { ConsumiblesModule } from "./consumibles/consumibles.module";

@Module({
  imports: [PrismaModule, ItemsModule, ConsumiblesModule],
})
export class AppModule {}
