-- CreateEnum
CREATE TYPE "TipoItem" AS ENUM ('CONSUMIBLE', 'EQUIPO');

-- CreateEnum
CREATE TYPE "MetodoSeguimiento" AS ENUM ('SERIE_MANUAL', 'ID_AUTOMATICO');

-- CreateEnum
CREATE TYPE "EstadoUnidad" AS ENUM ('DISPONIBLE', 'BAJA');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ENTRADA', 'SALIDA');

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoItem" NOT NULL,
    "metodoSeguimiento" "MetodoSeguimiento",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnidadEquipo" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "estado" "EstadoUnidad" NOT NULL DEFAULT 'DISPONIBLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnidadEquipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoEquipo" (
    "id" TEXT NOT NULL,
    "unidadEquipoId" TEXT NOT NULL,
    "tipo" "TipoMovimiento" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "destino" TEXT,
    "observacion" TEXT,

    CONSTRAINT "MovimientoEquipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoConsumible" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "tipo" "TipoMovimiento" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solicitante" TEXT,
    "observacion" TEXT,

    CONSTRAINT "MovimientoConsumible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receta" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Receta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecetaItem" (
    "id" TEXT NOT NULL,
    "recetaId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "cantidadNecesaria" INTEGER NOT NULL,

    CONSTRAINT "RecetaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ensamblaje" (
    "id" TEXT NOT NULL,
    "recetaId" TEXT NOT NULL,
    "cantidadArmada" INTEGER NOT NULL,
    "destino" TEXT,
    "observacion" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ensamblaje_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_nombre_key" ON "Item"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "UnidadEquipo_numeroSerie_key" ON "UnidadEquipo"("numeroSerie");

-- CreateIndex
CREATE UNIQUE INDEX "Receta_nombre_key" ON "Receta"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "RecetaItem_recetaId_itemId_key" ON "RecetaItem"("recetaId", "itemId");

-- AddForeignKey
ALTER TABLE "UnidadEquipo" ADD CONSTRAINT "UnidadEquipo_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoEquipo" ADD CONSTRAINT "MovimientoEquipo_unidadEquipoId_fkey" FOREIGN KEY ("unidadEquipoId") REFERENCES "UnidadEquipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoConsumible" ADD CONSTRAINT "MovimientoConsumible_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecetaItem" ADD CONSTRAINT "RecetaItem_recetaId_fkey" FOREIGN KEY ("recetaId") REFERENCES "Receta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecetaItem" ADD CONSTRAINT "RecetaItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ensamblaje" ADD CONSTRAINT "Ensamblaje_recetaId_fkey" FOREIGN KEY ("recetaId") REFERENCES "Receta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
