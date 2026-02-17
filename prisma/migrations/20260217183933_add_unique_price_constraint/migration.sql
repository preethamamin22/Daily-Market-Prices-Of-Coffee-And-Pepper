/*
  Warnings:

  - A unique constraint covering the columns `[date,commodity,district]` on the table `DailyPrice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DailyPrice_date_commodity_district_key" ON "DailyPrice"("date", "commodity", "district");
