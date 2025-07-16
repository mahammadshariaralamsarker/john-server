-- AlterTable
ALTER TABLE "User" ALTER COLUMN "twoFactorAuthenticate" DROP NOT NULL,
ALTER COLUMN "twoFactorAuthenticate" SET DEFAULT false;
