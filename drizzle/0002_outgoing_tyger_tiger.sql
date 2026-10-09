DROP INDEX "idx_constructor_exhaustion_constructor";--> statement-breakpoint
DROP INDEX "idx_constructor_exhaustion_exhausted";--> statement-breakpoint
DROP INDEX "idx_constructor_exhaustion_player_league";--> statement-breakpoint
DROP INDEX "idx_constructors_season";--> statement-breakpoint
DROP INDEX "idx_counterpick_usage_player_league";--> statement-breakpoint
DROP INDEX "idx_counterpick_usage_season";--> statement-breakpoint
DROP INDEX "idx_counterpicks_grand_prix_league";--> statement-breakpoint
DROP INDEX "idx_counterpicks_target";--> statement-breakpoint
DROP INDEX "idx_drafts_grand_prix_league";--> statement-breakpoint
DROP INDEX "idx_drafts_player_league";--> statement-breakpoint
DROP INDEX "idx_drafts_season";--> statement-breakpoint
DROP INDEX "idx_driver_exhaustion_driver";--> statement-breakpoint
DROP INDEX "idx_driver_exhaustion_exhausted";--> statement-breakpoint
DROP INDEX "idx_driver_exhaustion_player_league";--> statement-breakpoint
DROP INDEX "idx_drivers_constructor";--> statement-breakpoint
DROP INDEX "idx_drivers_season";--> statement-breakpoint
DROP INDEX "idx_grands_prix_completed";--> statement-breakpoint
DROP INDEX "idx_grands_prix_season";--> statement-breakpoint
DROP INDEX "idx_leagues_created_by";--> statement-breakpoint
DROP INDEX "idx_leagues_discord_guild";--> statement-breakpoint
DROP INDEX "idx_leagues_invite_code";--> statement-breakpoint
DROP INDEX "idx_leagues_season";--> statement-breakpoint
DROP INDEX "idx_player_leagues_league";--> statement-breakpoint
DROP INDEX "idx_player_leagues_player";--> statement-breakpoint
DROP INDEX "idx_player_leagues_season";--> statement-breakpoint
DROP INDEX "idx_player_scores_gp_league";--> statement-breakpoint
DROP INDEX "idx_player_scores_player_league";--> statement-breakpoint
DROP INDEX "idx_player_scores_season";--> statement-breakpoint
DROP INDEX "idx_players_discord_user";--> statement-breakpoint
DROP INDEX "idx_players_email";--> statement-breakpoint
DROP INDEX "idx_players_username";--> statement-breakpoint
DROP INDEX "idx_race_results_gp_session";--> statement-breakpoint
DROP INDEX "idx_scoring_rules_season";--> statement-breakpoint
CREATE INDEX "idx_constructor_exhaustion_constructor" ON "constructor_exhaustion" USING btree ("constructor_id");--> statement-breakpoint
CREATE INDEX "idx_constructor_exhaustion_exhausted" ON "constructor_exhaustion" USING btree ("player_id","league_id") WHERE (is_exhausted = true);--> statement-breakpoint
CREATE INDEX "idx_constructor_exhaustion_player_league" ON "constructor_exhaustion" USING btree ("player_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_constructors_season" ON "constructors" USING btree ("season_id");--> statement-breakpoint
CREATE INDEX "idx_counterpick_usage_player_league" ON "counterpick_usage" USING btree ("player_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_counterpick_usage_season" ON "counterpick_usage" USING btree ("season_id");--> statement-breakpoint
CREATE INDEX "idx_counterpicks_grand_prix_league" ON "counterpicks" USING btree ("grand_prix_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_counterpicks_target" ON "counterpicks" USING btree ("grand_prix_id","league_id","target_player_id");--> statement-breakpoint
CREATE INDEX "idx_drafts_grand_prix_league" ON "drafts" USING btree ("grand_prix_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_drafts_player_league" ON "drafts" USING btree ("player_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_drafts_season" ON "drafts" USING btree ("season_id");--> statement-breakpoint
CREATE INDEX "idx_driver_exhaustion_driver" ON "driver_exhaustion" USING btree ("driver_id");--> statement-breakpoint
CREATE INDEX "idx_driver_exhaustion_exhausted" ON "driver_exhaustion" USING btree ("player_id","league_id") WHERE (is_exhausted = true);--> statement-breakpoint
CREATE INDEX "idx_driver_exhaustion_player_league" ON "driver_exhaustion" USING btree ("player_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_drivers_constructor" ON "drivers" USING btree ("constructor_id");--> statement-breakpoint
CREATE INDEX "idx_drivers_season" ON "drivers" USING btree ("season_id");--> statement-breakpoint
CREATE INDEX "idx_grands_prix_completed" ON "grands_prix" USING btree ("season_id","is_completed");--> statement-breakpoint
CREATE INDEX "idx_grands_prix_season" ON "grands_prix" USING btree ("season_id");--> statement-breakpoint
CREATE INDEX "idx_leagues_created_by" ON "leagues" USING btree ("created_by_player_id");--> statement-breakpoint
CREATE INDEX "idx_leagues_discord_guild" ON "leagues" USING btree ("discord_guild_id");--> statement-breakpoint
CREATE INDEX "idx_leagues_invite_code" ON "leagues" USING btree ("invite_code");--> statement-breakpoint
CREATE INDEX "idx_leagues_season" ON "leagues" USING btree ("season_id");--> statement-breakpoint
CREATE INDEX "idx_player_leagues_league" ON "player_leagues" USING btree ("league_id");--> statement-breakpoint
CREATE INDEX "idx_player_leagues_player" ON "player_leagues" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "idx_player_leagues_season" ON "player_leagues" USING btree ("season_id");--> statement-breakpoint
CREATE INDEX "idx_player_scores_gp_league" ON "player_round_scores" USING btree ("grand_prix_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_player_scores_player_league" ON "player_round_scores" USING btree ("player_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_player_scores_season" ON "player_round_scores" USING btree ("season_id");--> statement-breakpoint
CREATE INDEX "idx_players_discord_user" ON "players" USING btree ("discord_user_id");--> statement-breakpoint
CREATE INDEX "idx_players_email" ON "players" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_players_username" ON "players" USING btree ("username");--> statement-breakpoint
CREATE INDEX "idx_race_results_gp_session" ON "race_results" USING btree ("grand_prix_id","session_type");--> statement-breakpoint
CREATE INDEX "idx_scoring_rules_season" ON "scoring_rules" USING btree ("season_id");