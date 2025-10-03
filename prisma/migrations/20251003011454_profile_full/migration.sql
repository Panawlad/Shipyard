/*
  Warnings:

  - You are about to drop the column `handle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `headline` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `twitter` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bio` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Made the column `location` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Builder', 'Founder', 'Developer', 'Designer', 'Investor', 'Marketer');

-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropIndex
DROP INDEX "public"."Profile_handle_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "handle",
DROP COLUMN "headline",
DROP COLUMN "tags",
DROP COLUMN "twitter",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "calendly" TEXT,
ADD COLUMN     "category" "Category" NOT NULL,
ADD COLUMN     "discord" TEXT,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "telegram" TEXT,
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "x" TEXT,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "skills" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
