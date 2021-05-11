ALTER TABLE "contactcenter"."tag_routing_tables" ADD COLUMN "campaignCriteriaId" int4;
ALTER TABLE "contactcenter"."tag_routing_tables" ALTER COLUMN "campaignCriteriaId" DROP NOT NULL;
