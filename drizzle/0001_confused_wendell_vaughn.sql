ALTER TABLE "leagues" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_slug_key" UNIQUE("slug");