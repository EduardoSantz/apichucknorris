-- prisma/migrations/0001_init/migration.sql
CREATE TABLE "Favorite" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "text" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "Favorite_id_key" ON "Favorite"("id");