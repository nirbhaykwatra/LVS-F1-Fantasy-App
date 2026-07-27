-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "constructor_exhaustion" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "constructor_exhaustion_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"player_id" integer NOT NULL,
	"league_id" integer NOT NULL,
	"constructor_id" integer NOT NULL,
	"last_grand_prix_id" integer NOT NULL,
	"consecutive_uses" integer DEFAULT 1 NOT NULL,
	"is_exhausted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "constructor_exhaustion_player_id_league_id_constructor_id_key" UNIQUE("player_id","league_id","constructor_id"),
	CONSTRAINT "constructor_exhaustion_consecutive_uses_check" CHECK ((consecutive_uses >= 0))
);
--> statement-breakpoint
CREATE TABLE "constructors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "constructors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"season_id" integer NOT NULL,
	"short_name" text NOT NULL,
	"full_name" text NOT NULL,
	"color_hex" char(7) DEFAULT '#FFFFFF' NOT NULL,
	"ergast_id" text,
	CONSTRAINT "constructors_season_id_short_name_key" UNIQUE("season_id","short_name")
);
--> statement-breakpoint
CREATE TABLE "counterpick_usage" (
	"player_id" integer,
	"league_id" integer,
	"season_id" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "counterpick_usage_pkey" PRIMARY KEY("player_id","league_id","season_id"),
	CONSTRAINT "counterpick_usage_used_count_check" CHECK ((used_count >= 0))
);
--> statement-breakpoint
CREATE TABLE "counterpicks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "counterpicks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"grand_prix_id" integer NOT NULL,
	"league_id" integer NOT NULL,
	"picking_player_id" integer NOT NULL,
	"target_player_id" integer NOT NULL,
	"target_driver_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "counterpicks_grand_prix_id_league_id_picking_player_id_key" UNIQUE("grand_prix_id","league_id","picking_player_id"),
	CONSTRAINT "counterpicks_check" CHECK ((picking_player_id <> target_player_id))
);
--> statement-breakpoint
CREATE TABLE "drafts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "drafts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"player_id" integer NOT NULL,
	"league_id" integer NOT NULL,
	"grand_prix_id" integer NOT NULL,
	"driver1_id" integer NOT NULL,
	"driver2_id" integer NOT NULL,
	"driver3_id" integer NOT NULL,
	"wildcard_id" integer NOT NULL,
	"constructor_id" integer NOT NULL,
	"is_auto_assigned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "drafts_player_id_league_id_grand_prix_id_key" UNIQUE("player_id","league_id","grand_prix_id"),
	CONSTRAINT "drafts_check" CHECK (((driver1_id <> driver2_id) AND (driver1_id <> driver3_id) AND (driver1_id <> wildcard_id) AND (driver2_id <> driver3_id) AND (driver2_id <> wildcard_id) AND (driver3_id <> wildcard_id)))
);
--> statement-breakpoint
CREATE TABLE "driver_exhaustion" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "driver_exhaustion_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"player_id" integer NOT NULL,
	"league_id" integer NOT NULL,
	"driver_id" integer NOT NULL,
	"last_grand_prix_id" integer NOT NULL,
	"consecutive_uses" integer DEFAULT 1 NOT NULL,
	"is_exhausted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "driver_exhaustion_player_id_league_id_driver_id_key" UNIQUE("player_id","league_id","driver_id"),
	CONSTRAINT "driver_exhaustion_consecutive_uses_check" CHECK ((consecutive_uses >= 0))
);
--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "drivers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"season_id" integer NOT NULL,
	"code" char(3) NOT NULL,
	"number" smallint NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"constructor_id" integer NOT NULL,
	"ergast_id" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"date_of_birth" date,
	"nationality" text,
	"driver_image_url" text,
	CONSTRAINT "drivers_season_id_code_number_key" UNIQUE("season_id","code","number")
);
--> statement-breakpoint
CREATE TABLE "grands_prix" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grands_prix_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"season_id" integer NOT NULL,
	"round_number" smallint NOT NULL,
	"event_name" text NOT NULL,
	"circuit_key" text,
	"event_format" text DEFAULT 'conventional' NOT NULL,
	"quali_date_utc" timestamp with time zone,
	"sprint_quali_date_utc" timestamp with time zone,
	"sprint_date_utc" timestamp with time zone,
	"race_date_utc" timestamp with time zone,
	"draft_deadline_utc" timestamp with time zone,
	"draft_reset_utc" timestamp with time zone,
	"counterpick_deadline_utc" timestamp with time zone,
	"is_completed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "grands_prix_season_id_round_number_key" UNIQUE("season_id","round_number")
);
--> statement-breakpoint
CREATE TABLE "leagues" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "leagues_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"discord_guild_id" bigint,
	"season_id" integer NOT NULL,
	"embed_color" integer DEFAULT 15135274 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"counterpick_limit" integer DEFAULT 3 NOT NULL,
	CONSTRAINT "leagues_discord_guild_id_name_key" UNIQUE("discord_guild_id","name"),
	CONSTRAINT "leagues_season_id_name_key" UNIQUE("season_id","name")
);
--> statement-breakpoint
CREATE TABLE "player_leagues" (
	"player_id" integer,
	"league_id" integer,
	"team_name" text,
	"team_motto" text,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "player_leagues_pkey" PRIMARY KEY("player_id","league_id")
);
--> statement-breakpoint
CREATE TABLE "player_round_scores" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "player_round_scores_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"player_id" integer NOT NULL,
	"league_id" integer NOT NULL,
	"grand_prix_id" integer NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"breakdown_json" jsonb DEFAULT '{}' NOT NULL,
	"calculated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "player_round_scores_player_id_league_id_grand_prix_id_key" UNIQUE("player_id","league_id","grand_prix_id")
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "players_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"discord_user_id" bigint CONSTRAINT "players_discord_user_id_key" UNIQUE,
	"username" text NOT NULL CONSTRAINT "players_username_key" UNIQUE,
	"password" varchar(255),
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "race_results" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "race_results_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"grand_prix_id" integer NOT NULL,
	"session_type" text NOT NULL,
	"driver_id" integer NOT NULL,
	"position" smallint NOT NULL,
	CONSTRAINT "race_results_grand_prix_id_session_type_driver_id_key" UNIQUE("grand_prix_id","session_type","driver_id"),
	CONSTRAINT "race_results_session_type_check" CHECK ((session_type = ANY (ARRAY['qualifying'::text, 'race'::text, 'sprint'::text, 'sprint_qualifying'::text])))
);
--> statement-breakpoint
CREATE TABLE "scoring_rules" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "scoring_rules_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"season_id" integer NOT NULL,
	"rule_key" text NOT NULL,
	"rule_value" jsonb NOT NULL,
	CONSTRAINT "scoring_rules_season_id_rule_key_key" UNIQUE("season_id","rule_key")
);
--> statement-breakpoint
CREATE TABLE "seasons" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "seasons_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"year" smallint NOT NULL CONSTRAINT "seasons_year_key" UNIQUE,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_constructor_exhaustion_constructor" ON "constructor_exhaustion" ("constructor_id");--> statement-breakpoint
CREATE INDEX "idx_constructor_exhaustion_exhausted" ON "constructor_exhaustion" ("player_id","league_id") WHERE (is_exhausted = true);--> statement-breakpoint
CREATE INDEX "idx_constructor_exhaustion_player_league" ON "constructor_exhaustion" ("player_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_constructors_season" ON "constructors" ("season_id");--> statement-breakpoint
CREATE INDEX "idx_counterpick_usage_player_league" ON "counterpick_usage" ("player_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_counterpick_usage_season" ON "counterpick_usage" ("season_id");--> statement-breakpoint
CREATE INDEX "idx_counterpicks_grand_prix_league" ON "counterpicks" ("grand_prix_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_counterpicks_target" ON "counterpicks" ("grand_prix_id","league_id","target_player_id");--> statement-breakpoint
CREATE INDEX "idx_drafts_grand_prix_league" ON "drafts" ("grand_prix_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_drafts_player_league" ON "drafts" ("player_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_driver_exhaustion_driver" ON "driver_exhaustion" ("driver_id");--> statement-breakpoint
CREATE INDEX "idx_driver_exhaustion_exhausted" ON "driver_exhaustion" ("player_id","league_id") WHERE (is_exhausted = true);--> statement-breakpoint
CREATE INDEX "idx_driver_exhaustion_player_league" ON "driver_exhaustion" ("player_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_drivers_constructor" ON "drivers" ("constructor_id");--> statement-breakpoint
CREATE INDEX "idx_drivers_season" ON "drivers" ("season_id");--> statement-breakpoint
CREATE INDEX "idx_grands_prix_completed" ON "grands_prix" ("season_id","is_completed");--> statement-breakpoint
CREATE INDEX "idx_grands_prix_season" ON "grands_prix" ("season_id");--> statement-breakpoint
CREATE INDEX "idx_leagues_discord_guild" ON "leagues" ("discord_guild_id");--> statement-breakpoint
CREATE INDEX "idx_leagues_season" ON "leagues" ("season_id");--> statement-breakpoint
CREATE INDEX "idx_player_leagues_league" ON "player_leagues" ("league_id");--> statement-breakpoint
CREATE INDEX "idx_player_leagues_player" ON "player_leagues" ("player_id");--> statement-breakpoint
CREATE INDEX "idx_player_scores_gp_league" ON "player_round_scores" ("grand_prix_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_player_scores_player_league" ON "player_round_scores" ("player_id","league_id");--> statement-breakpoint
CREATE INDEX "idx_players_discord_user" ON "players" ("discord_user_id");--> statement-breakpoint
CREATE INDEX "idx_players_username" ON "players" ("username");--> statement-breakpoint
CREATE INDEX "idx_race_results_gp_session" ON "race_results" ("grand_prix_id","session_type");--> statement-breakpoint
CREATE INDEX "idx_scoring_rules_season" ON "scoring_rules" ("season_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_seasons_active" ON "seasons" ("is_active") WHERE (is_active = true);--> statement-breakpoint
ALTER TABLE "constructor_exhaustion" ADD CONSTRAINT "constructor_exhaustion_constructor_id_fkey" FOREIGN KEY ("constructor_id") REFERENCES "constructors"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "constructor_exhaustion" ADD CONSTRAINT "constructor_exhaustion_last_grand_prix_id_fkey" FOREIGN KEY ("last_grand_prix_id") REFERENCES "grands_prix"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "constructor_exhaustion" ADD CONSTRAINT "constructor_exhaustion_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "constructor_exhaustion" ADD CONSTRAINT "constructor_exhaustion_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "constructors" ADD CONSTRAINT "constructors_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "counterpick_usage" ADD CONSTRAINT "counterpick_usage_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "counterpick_usage" ADD CONSTRAINT "counterpick_usage_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "counterpick_usage" ADD CONSTRAINT "counterpick_usage_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "counterpicks" ADD CONSTRAINT "counterpicks_grand_prix_id_fkey" FOREIGN KEY ("grand_prix_id") REFERENCES "grands_prix"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "counterpicks" ADD CONSTRAINT "counterpicks_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "counterpicks" ADD CONSTRAINT "counterpicks_picking_player_id_fkey" FOREIGN KEY ("picking_player_id") REFERENCES "players"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "counterpicks" ADD CONSTRAINT "counterpicks_target_driver_id_fkey" FOREIGN KEY ("target_driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "counterpicks" ADD CONSTRAINT "counterpicks_target_player_id_fkey" FOREIGN KEY ("target_player_id") REFERENCES "players"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_constructor_id_fkey" FOREIGN KEY ("constructor_id") REFERENCES "constructors"("id");--> statement-breakpoint
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_driver1_id_fkey" FOREIGN KEY ("driver1_id") REFERENCES "drivers"("id");--> statement-breakpoint
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_driver2_id_fkey" FOREIGN KEY ("driver2_id") REFERENCES "drivers"("id");--> statement-breakpoint
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_driver3_id_fkey" FOREIGN KEY ("driver3_id") REFERENCES "drivers"("id");--> statement-breakpoint
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_grand_prix_id_fkey" FOREIGN KEY ("grand_prix_id") REFERENCES "grands_prix"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_wildcard_id_fkey" FOREIGN KEY ("wildcard_id") REFERENCES "drivers"("id");--> statement-breakpoint
ALTER TABLE "driver_exhaustion" ADD CONSTRAINT "driver_exhaustion_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "driver_exhaustion" ADD CONSTRAINT "driver_exhaustion_last_grand_prix_id_fkey" FOREIGN KEY ("last_grand_prix_id") REFERENCES "grands_prix"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "driver_exhaustion" ADD CONSTRAINT "driver_exhaustion_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "driver_exhaustion" ADD CONSTRAINT "driver_exhaustion_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_constructor_id_fkey" FOREIGN KEY ("constructor_id") REFERENCES "constructors"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "grands_prix" ADD CONSTRAINT "grands_prix_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "player_leagues" ADD CONSTRAINT "player_leagues_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "player_leagues" ADD CONSTRAINT "player_leagues_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "player_round_scores" ADD CONSTRAINT "player_round_scores_grand_prix_id_fkey" FOREIGN KEY ("grand_prix_id") REFERENCES "grands_prix"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "player_round_scores" ADD CONSTRAINT "player_round_scores_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "player_round_scores" ADD CONSTRAINT "player_round_scores_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "race_results" ADD CONSTRAINT "race_results_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id");--> statement-breakpoint
ALTER TABLE "race_results" ADD CONSTRAINT "race_results_grand_prix_id_fkey" FOREIGN KEY ("grand_prix_id") REFERENCES "grands_prix"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "scoring_rules" ADD CONSTRAINT "scoring_rules_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE;--> statement-breakpoint
CREATE VIEW "v_driver_draft_stats" AS (SELECT d.id AS driver_id, d.code, d.first_name, d.last_name, d.season_id, dr.league_id, l.name AS league_name, count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id THEN dr.id ELSE NULL::integer END) AS times_drafted_as_main, count(DISTINCT CASE WHEN dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END) AS times_drafted_as_bogey, count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END) AS total_times_drafted, count(DISTINCT dr.player_id) AS unique_players_drafted_by FROM drivers d LEFT JOIN drafts dr ON dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id LEFT JOIN leagues l ON l.id = dr.league_id GROUP BY d.id, d.code, d.first_name, d.last_name, d.season_id, dr.league_id, l.name ORDER BY (count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END)) DESC);--> statement-breakpoint
CREATE VIEW "v_driver_draft_stats_season" AS (SELECT d.id AS driver_id, d.code, d.first_name, d.last_name, d.season_id, s.year AS season_year, count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id THEN dr.id ELSE NULL::integer END) AS times_drafted_as_main, count(DISTINCT CASE WHEN dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END) AS times_drafted_as_bogey, count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END) AS total_times_drafted, count(DISTINCT dr.player_id) AS unique_players_drafted_by, count(DISTINCT dr.league_id) AS leagues_drafted_in FROM drivers d JOIN seasons s ON s.id = d.season_id LEFT JOIN drafts dr ON dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id GROUP BY d.id, d.code, d.first_name, d.last_name, d.season_id, s.year ORDER BY (count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END)) DESC);--> statement-breakpoint
CREATE VIEW "v_grand_prix_leaderboard" AS (SELECT prs.league_id, l.name AS league_name, gp.id AS grand_prix_id, gp.event_name, gp.round_number, p.id AS player_id, p.username, pl.team_name, prs.total_points, prs.breakdown_json, rank() OVER (PARTITION BY prs.league_id, gp.id ORDER BY prs.total_points DESC) AS rank FROM player_round_scores prs JOIN players p ON p.id = prs.player_id JOIN player_leagues pl ON pl.player_id = p.id AND pl.league_id = prs.league_id JOIN leagues l ON l.id = prs.league_id JOIN grands_prix gp ON gp.id = prs.grand_prix_id ORDER BY prs.league_id, gp.round_number, prs.total_points DESC);--> statement-breakpoint
CREATE VIEW "v_league_leaderboard" AS (SELECT pl.league_id, l.name AS league_name, l.season_id, p.id AS player_id, p.username, pl.team_name, COALESCE(sum(prs.total_points), 0::bigint) AS total_points, count(DISTINCT prs.grand_prix_id) AS rounds_played, rank() OVER (PARTITION BY pl.league_id ORDER BY (COALESCE(sum(prs.total_points), 0::bigint)) DESC) AS rank FROM player_leagues pl JOIN players p ON p.id = pl.player_id JOIN leagues l ON l.id = pl.league_id LEFT JOIN player_round_scores prs ON prs.player_id = p.id AND prs.league_id = pl.league_id LEFT JOIN grands_prix gp ON gp.id = prs.grand_prix_id AND gp.season_id = l.season_id GROUP BY pl.league_id, l.name, l.season_id, p.id, p.username, pl.team_name ORDER BY pl.league_id, (COALESCE(sum(prs.total_points), 0::bigint)) DESC);--> statement-breakpoint
CREATE VIEW "v_league_summary" AS (SELECT l.id AS league_id, l.name AS league_name, l.discord_guild_id, l.season_id, s.year AS season_year, count(DISTINCT pl.player_id) AS player_count, count(DISTINCT prs.id) AS total_scores_submitted, count(DISTINCT gp.id) FILTER (WHERE gp.is_completed) AS completed_rounds, count(DISTINCT gp.id) AS total_rounds, l.created_at FROM leagues l JOIN seasons s ON s.id = l.season_id LEFT JOIN player_leagues pl ON pl.league_id = l.id LEFT JOIN grands_prix gp ON gp.season_id = l.season_id LEFT JOIN player_round_scores prs ON prs.league_id = l.id AND prs.grand_prix_id = gp.id GROUP BY l.id, l.name, l.discord_guild_id, l.season_id, s.year, l.created_at ORDER BY l.created_at DESC);--> statement-breakpoint
CREATE VIEW "v_player_league_stats" AS (SELECT p.id AS player_id, p.username, pl.team_name, pl.league_id, l.name AS league_name, l.season_id, count(DISTINCT prs.grand_prix_id) AS rounds_participated, count(DISTINCT gp.id) FILTER (WHERE gp.is_completed) AS total_completed_rounds, COALESCE(sum(prs.total_points), 0::bigint) AS total_points, COALESCE(avg(prs.total_points), 0::numeric) AS avg_points_per_round, COALESCE(max(prs.total_points), 0) AS best_round_score, COALESCE(min(prs.total_points), 0) AS worst_round_score, rank() OVER (PARTITION BY pl.league_id ORDER BY (COALESCE(sum(prs.total_points), 0::bigint)) DESC) AS current_rank FROM players p JOIN player_leagues pl ON pl.player_id = p.id JOIN leagues l ON l.id = pl.league_id LEFT JOIN grands_prix gp ON gp.season_id = l.season_id LEFT JOIN player_round_scores prs ON prs.player_id = p.id AND prs.league_id = pl.league_id AND prs.grand_prix_id = gp.id GROUP BY p.id, p.username, pl.team_name, pl.league_id, l.name, l.season_id);--> statement-breakpoint
CREATE VIEW "v_player_leagues" AS (SELECT p.id AS player_id, p.username, p.discord_user_id, pl.league_id, l.name AS league_name, l.season_id, s.year AS season_year, pl.joined_at, count(DISTINCT prs.id) AS rounds_played_in_league, COALESCE(sum(prs.total_points), 0::bigint) AS total_points_in_league FROM players p JOIN player_leagues pl ON pl.player_id = p.id JOIN leagues l ON l.id = pl.league_id JOIN seasons s ON s.id = l.season_id LEFT JOIN player_round_scores prs ON prs.player_id = p.id AND prs.league_id = pl.league_id LEFT JOIN grands_prix gp ON gp.id = prs.grand_prix_id AND gp.season_id = l.season_id GROUP BY p.id, p.username, p.discord_user_id, pl.league_id, l.name, l.season_id, s.year, pl.joined_at ORDER BY p.id, pl.joined_at DESC);--> statement-breakpoint
CREATE VIEW "v_player_season_detail" AS (SELECT pl.league_id, l.name AS league_name, l.season_id, p.id AS player_id, p.username, pl.team_name, gp.round_number, gp.event_name, gp.is_completed, prs.total_points, prs.breakdown_json, prs.calculated_at, d.driver1_code, d.driver2_code, d.driver3_code, d.wildcard_code, c.short_name AS constructor FROM player_leagues pl JOIN players p ON p.id = pl.player_id JOIN leagues l ON l.id = pl.league_id JOIN grands_prix gp ON gp.season_id = l.season_id LEFT JOIN player_round_scores prs ON prs.player_id = p.id AND prs.league_id = pl.league_id AND prs.grand_prix_id = gp.id LEFT JOIN LATERAL ( SELECT dr1.code AS driver1_code, dr2.code AS driver2_code, dr3.code AS driver3_code, dr4.code AS wildcard_code, drafts.constructor_id FROM drafts JOIN drivers dr1 ON dr1.id = drafts.driver1_id JOIN drivers dr2 ON dr2.id = drafts.driver2_id JOIN drivers dr3 ON dr3.id = drafts.driver3_id JOIN drivers dr4 ON dr4.id = drafts.wildcard_id WHERE drafts.player_id = p.id AND drafts.league_id = pl.league_id AND drafts.grand_prix_id = gp.id LIMIT 1) d ON true LEFT JOIN constructors c ON c.id = d.constructor_id ORDER BY pl.league_id, p.id, gp.round_number);
*/