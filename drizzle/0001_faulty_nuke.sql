ALTER TABLE "player_leagues" DROP CONSTRAINT "player_leagues_role_check";--> statement-breakpoint
ALTER TABLE "race_results" ADD COLUMN "constructor_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "race_results" ADD CONSTRAINT "race_results_constructor_id_fkey" FOREIGN KEY ("constructor_id") REFERENCES "public"."constructors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_leagues" ADD CONSTRAINT "player_leagues_role_check" CHECK (role = ANY (ARRAY['owner'::text, 'player'::text]));