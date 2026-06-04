-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "tier" "Tier" NOT NULL DEFAULT 'FREE';
