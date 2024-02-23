-- CreateEnum
CREATE TYPE "ProjectionType" AS ENUM ('STANDARD', 'IMAX', 'DOLBY_CINEMA', 'RPX', 'SCREENX', 'PLF');

-- CreateEnum
CREATE TYPE "SoundSystemType" AS ENUM ('MONO', 'STEREO', 'DOLBY_DIGITAL', 'DOLBY_ATMOS', 'DTS', 'DTS_X', 'SONY_SDDS', 'AURO_3D', 'IMAX_ENHANCED');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('ACTION', 'ADVENTURE', 'ANIMATION', 'COMEDY', 'CRIME', 'DOCUMENTARY', 'DRAMA', 'FAMILY', 'FANTASY', 'FILM_NOIR', 'HISTORY', 'HORROR', 'MUSIC', 'MYSTERY', 'ROMANCE', 'SCI_FI', 'SHORT', 'SPORT', 'THRILLER', 'WAR', 'WESTERN');

-- CreateEnum
CREATE TYPE "ShowtimeStatus" AS ENUM ('POSTPONED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Manager" ADD COLUMN     "cinemaId" INTEGER;

-- CreateTable
CREATE TABLE "Cinema" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Cinema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cinemaId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Screen" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "number" INTEGER NOT NULL,
    "cinemaId" INTEGER NOT NULL,
    "projectionType" "ProjectionType" NOT NULL DEFAULT 'STANDARD',
    "soundSystemType" "SoundSystemType" NOT NULL DEFAULT 'DOLBY_ATMOS',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 180,

    CONSTRAINT "Screen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seat" (
    "row" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "screenId" INTEGER NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("screenId","row","column")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "genre" "Genre" NOT NULL,
    "duration" INTEGER NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "posterUrl" TEXT,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Showtime" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "movieId" INTEGER NOT NULL,
    "screenId" INTEGER NOT NULL,
    "status" "ShowtimeStatus",

    CONSTRAINT "Showtime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "showtimeId" INTEGER NOT NULL,
    "row" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "screenId" INTEGER NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "qrCode" TEXT,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_cinemaId_key" ON "Address"("cinemaId");

-- CreateIndex
CREATE UNIQUE INDEX "Screen_cinemaId_number_key" ON "Screen"("cinemaId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Showtime_startTime_screenId_key" ON "Showtime"("startTime", "screenId");

-- CreateIndex
CREATE INDEX "seatIndex" ON "Booking"("screenId", "row", "column");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_screenId_row_column_showtimeId_key" ON "Booking"("screenId", "row", "column", "showtimeId");

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "Cinema"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "Cinema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Screen" ADD CONSTRAINT "Screen_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "Cinema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "Showtime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_screenId_row_column_fkey" FOREIGN KEY ("screenId", "row", "column") REFERENCES "Seat"("screenId", "row", "column") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
