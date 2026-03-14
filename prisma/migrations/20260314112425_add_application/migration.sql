-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('TESOL_TEFL_CERTIFICATION', 'ONLINE_DISTANCE_TESOL_TEFL');

-- CreateEnum
CREATE TYPE "Location" AS ENUM ('TUSCANY', 'URUGUAY');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateTable
CREATE TABLE "application" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "courseType" "CourseType" NOT NULL,
    "location" "Location" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "fax" TEXT,
    "skype" TEXT,
    "nativeEnglishSpeaker" BOOLEAN NOT NULL,
    "currentProfession" TEXT,
    "focusOfStudies" TEXT,
    "university" TEXT,
    "passportsHeld" TEXT,
    "previousTeachingExp" TEXT,
    "requiresAccommodation" BOOLEAN NOT NULL DEFAULT false,
    "specialRequirements" TEXT,
    "hasDyslexia" BOOLEAN NOT NULL DEFAULT false,
    "psychologicalDisorder" TEXT,
    "healthCondition" TEXT,
    "suitableToTeachChildren" BOOLEAN NOT NULL DEFAULT true,
    "specialNeeds" TEXT,
    "criminalOffense" BOOLEAN NOT NULL DEFAULT false,
    "motivation" TEXT NOT NULL,
    "additionalComments" TEXT,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "dataConsent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "application_pkey" PRIMARY KEY ("id")
);
