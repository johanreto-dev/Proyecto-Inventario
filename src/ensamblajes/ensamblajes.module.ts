import { Module } from "@nestjs/common";
import { EnsamblajesController } from "./ensamblajes.controller";
import { EnsamblajesService } from "./ensamblajes.service";

@Module({
  controllers: [EnsamblajesController],
  providers: [EnsamblajesService],
})
export class EnsamblajesModule {}
