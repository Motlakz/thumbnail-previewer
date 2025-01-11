-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('CREDITS', 'SUBSCRIPTION');

-- CreateEnum
CREATE TYPE "PlanId" AS ENUM ('BASIC', 'PREMIUM', 'PRO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fungiesCustomerId" TEXT,
    "name" TEXT,
    "channelName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "fungiesSubscriptionId" TEXT,
    "status" TEXT NOT NULL,
    "planType" "PlanType" NOT NULL,
    "planId" "PlanId" NOT NULL,
    "credits" INTEGER,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_fungiesCustomerId_key" ON "User"("fungiesCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Package_id_key" ON "Package"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Package_userId_key" ON "Package"("userId");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
