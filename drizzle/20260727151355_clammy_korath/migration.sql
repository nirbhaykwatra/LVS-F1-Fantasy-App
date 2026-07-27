ALTER TABLE "leagues" ADD COLUMN "created_by_player_id" integer;--> statement-breakpoint
ALTER TABLE "leagues" ADD COLUMN "invite_code" text;--> statement-breakpoint
ALTER TABLE "player_leagues" ADD COLUMN "role" text DEFAULT 'member' NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_invite_code_key" UNIQUE("invite_code");--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_email_key" UNIQUE("email");--> statement-breakpoint
CREATE INDEX "idx_leagues_created_by" ON "leagues" ("created_by_player_id");--> statement-breakpoint
CREATE INDEX "idx_leagues_invite_code" ON "leagues" ("invite_code");--> statement-breakpoint
CREATE INDEX "idx_players_email" ON "players" ("email");--> statement-breakpoint
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_created_by_player_id_fkey" FOREIGN KEY ("created_by_player_id") REFERENCES "players"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "player_leagues" ADD CONSTRAINT "player_leagues_role_check" CHECK ((role = ANY (ARRAY['owner'::text, 'member'::text])));