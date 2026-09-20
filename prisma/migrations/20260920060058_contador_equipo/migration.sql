-- CreateTable
CREATE TABLE "ContadorEquipo" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "ultimoValor" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ContadorEquipo_pkey" PRIMARY KEY ("id")
);
