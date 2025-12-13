-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "createdBy" INTEGER;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
