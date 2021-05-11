ALTER TABLE "contactcenter"."affiliate_payout_settings" ADD COLUMN "affiliateId" uuid;
ALTER TABLE "contactcenter"."affiliate_payout_settings" ALTER COLUMN "affiliateId" DROP NOT NULL;
