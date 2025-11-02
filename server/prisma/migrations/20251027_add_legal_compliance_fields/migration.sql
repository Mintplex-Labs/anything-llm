-- AlterTable
ALTER TABLE "purchase_orders" 
ADD COLUMN IF NOT EXISTS "warrantyTerms" TEXT,
ADD COLUMN IF NOT EXISTS "penaltyClauses" TEXT,
ADD COLUMN IF NOT EXISTS "qualityStandards" TEXT,
ADD COLUMN IF NOT EXISTS "inspectionReqs" TEXT,
ADD COLUMN IF NOT EXISTS "complianceReqs" TEXT,
ADD COLUMN IF NOT EXISTS "insuranceReqs" TEXT,
ADD COLUMN IF NOT EXISTS "disputeResolution" TEXT,
ADD COLUMN IF NOT EXISTS "specialConditions" TEXT,
ADD COLUMN IF NOT EXISTS "legalRisks" TEXT;
