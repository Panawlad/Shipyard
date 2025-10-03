/*
  Warnings:

  - The `skills` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `avatarUrl` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropIndex
DROP INDEX "public"."Profile_username_key";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "location" DROP NOT NULL,
DROP COLUMN "skills",
ADD COLUMN     "skills" TEXT[],
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "avatarUrl" SET NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "category" SET DEFAULT 'Developer';

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
