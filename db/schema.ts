import { pgTable, integer, text, smallint, bigint, char, boolean, varchar, jsonb, timestamp, date, index, uniqueIndex, foreignKey, primaryKey, unique, check, pgView, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const constructorExhaustion = pgTable("constructor_exhaustion", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	playerId: integer("player_id").notNull().references(() => players.id, { onDelete: "cascade" } ),
	leagueId: integer("league_id").notNull().references(() => leagues.id, { onDelete: "cascade" } ),
	constructorId: integer("constructor_id").notNull().references(() => constructors.id, { onDelete: "cascade" } ),
	lastGrandPrixId: integer("last_grand_prix_id").notNull().references(() => grandsPrix.id, { onDelete: "cascade" } ),
	consecutiveUses: integer("consecutive_uses").default(1).notNull(),
	isExhausted: boolean("is_exhausted").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_constructor_exhaustion_constructor").using("btree", table.constructorId.asc().nullsLast()),
	index("idx_constructor_exhaustion_exhausted").using("btree", table.playerId.asc().nullsLast(), table.leagueId.asc().nullsLast()).where(sql`(is_exhausted = true)`),
	index("idx_constructor_exhaustion_player_league").using("btree", table.playerId.asc().nullsLast(), table.leagueId.asc().nullsLast()),
	unique("constructor_exhaustion_player_id_league_id_constructor_id_key").on(table.playerId, table.leagueId, table.constructorId),check("constructor_exhaustion_consecutive_uses_check", sql`(consecutive_uses >= 0)`),]);

export const constructors = pgTable("constructors", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	seasonId: integer("season_id").notNull().references(() => seasons.id, { onDelete: "cascade" } ),
	shortName: text("short_name").notNull(),
	fullName: text("full_name").notNull(),
	colorHex: char("color_hex", { length: 7 }).default("#FFFFFF").notNull(),
	ergastId: text("ergast_id"),
}, (table) => [
	index("idx_constructors_season").using("btree", table.seasonId.asc().nullsLast()),
	unique("constructors_season_id_short_name_key").on(table.seasonId, table.shortName),]);

export const counterpickUsage = pgTable("counterpick_usage", {
	playerId: integer("player_id").notNull().references(() => players.id, { onDelete: "cascade" } ),
	leagueId: integer("league_id").notNull().references(() => leagues.id, { onDelete: "cascade" } ),
	seasonId: integer("season_id").notNull().references(() => seasons.id, { onDelete: "cascade" } ),
	usedCount: integer("used_count").default(0).notNull(),
}, (table) => [
	primaryKey({ columns: [table.playerId, table.leagueId, table.seasonId], name: "counterpick_usage_pkey"}),
	index("idx_counterpick_usage_player_league").using("btree", table.playerId.asc().nullsLast(), table.leagueId.asc().nullsLast()),
	index("idx_counterpick_usage_season").using("btree", table.seasonId.asc().nullsLast()),
check("counterpick_usage_used_count_check", sql`(used_count >= 0)`),]);

export const counterpicks = pgTable("counterpicks", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	grandPrixId: integer("grand_prix_id").notNull().references(() => grandsPrix.id, { onDelete: "cascade" } ),
	leagueId: integer("league_id").notNull().references(() => leagues.id, { onDelete: "cascade" } ),
	pickingPlayerId: integer("picking_player_id").notNull().references(() => players.id, { onDelete: "cascade" } ),
	targetPlayerId: integer("target_player_id").notNull().references(() => players.id, { onDelete: "cascade" } ),
	targetDriverId: integer("target_driver_id").notNull().references(() => drivers.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_counterpicks_grand_prix_league").using("btree", table.grandPrixId.asc().nullsLast(), table.leagueId.asc().nullsLast()),
	index("idx_counterpicks_target").using("btree", table.grandPrixId.asc().nullsLast(), table.leagueId.asc().nullsLast(), table.targetPlayerId.asc().nullsLast()),
	unique("counterpicks_grand_prix_id_league_id_picking_player_id_key").on(table.grandPrixId, table.leagueId, table.pickingPlayerId),check("counterpicks_check", sql`(picking_player_id <> target_player_id)`),]);

export const drafts = pgTable("drafts", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	playerId: integer("player_id").notNull().references(() => players.id, { onDelete: "cascade" } ),
	leagueId: integer("league_id").notNull().references(() => leagues.id, { onDelete: "cascade" } ),
	grandPrixId: integer("grand_prix_id").notNull().references(() => grandsPrix.id, { onDelete: "cascade" } ),
	driver1Id: integer("driver1_id").notNull().references(() => drivers.id),
	driver2Id: integer("driver2_id").notNull().references(() => drivers.id),
	driver3Id: integer("driver3_id").notNull().references(() => drivers.id),
	wildcardId: integer("wildcard_id").notNull().references(() => drivers.id),
	constructorId: integer("constructor_id").notNull().references(() => constructors.id),
	isAutoAssigned: boolean("is_auto_assigned").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_drafts_grand_prix_league").using("btree", table.grandPrixId.asc().nullsLast(), table.leagueId.asc().nullsLast()),
	index("idx_drafts_player_league").using("btree", table.playerId.asc().nullsLast(), table.leagueId.asc().nullsLast()),
	unique("drafts_player_id_league_id_grand_prix_id_key").on(table.playerId, table.leagueId, table.grandPrixId),check("drafts_check", sql`((driver1_id <> driver2_id) AND (driver1_id <> driver3_id) AND (driver1_id <> wildcard_id) AND (driver2_id <> driver3_id) AND (driver2_id <> wildcard_id) AND (driver3_id <> wildcard_id))`),]);

export const driverExhaustion = pgTable("driver_exhaustion", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	playerId: integer("player_id").notNull().references(() => players.id, { onDelete: "cascade" } ),
	leagueId: integer("league_id").notNull().references(() => leagues.id, { onDelete: "cascade" } ),
	driverId: integer("driver_id").notNull().references(() => drivers.id, { onDelete: "cascade" } ),
	lastGrandPrixId: integer("last_grand_prix_id").notNull().references(() => grandsPrix.id, { onDelete: "cascade" } ),
	consecutiveUses: integer("consecutive_uses").default(1).notNull(),
	isExhausted: boolean("is_exhausted").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_driver_exhaustion_driver").using("btree", table.driverId.asc().nullsLast()),
	index("idx_driver_exhaustion_exhausted").using("btree", table.playerId.asc().nullsLast(), table.leagueId.asc().nullsLast()).where(sql`(is_exhausted = true)`),
	index("idx_driver_exhaustion_player_league").using("btree", table.playerId.asc().nullsLast(), table.leagueId.asc().nullsLast()),
	unique("driver_exhaustion_player_id_league_id_driver_id_key").on(table.playerId, table.leagueId, table.driverId),check("driver_exhaustion_consecutive_uses_check", sql`(consecutive_uses >= 0)`),]);

export const drivers = pgTable("drivers", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	seasonId: integer("season_id").notNull().references(() => seasons.id, { onDelete: "cascade" } ),
	code: char({ length: 3 }).notNull(),
	number: smallint().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	constructorId: integer("constructor_id").notNull().references(() => constructors.id, { onDelete: "cascade" } ),
	ergastId: text("ergast_id"),
	isActive: boolean("is_active").default(true).notNull(),
	dateOfBirth: date("date_of_birth"),
	nationality: text(),
	driverImageUrl: text("driver_image_url"),
}, (table) => [
	index("idx_drivers_constructor").using("btree", table.constructorId.asc().nullsLast()),
	index("idx_drivers_season").using("btree", table.seasonId.asc().nullsLast()),
	unique("drivers_season_id_code_number_key").on(table.seasonId, table.code, table.number),]);

export const grandsPrix = pgTable("grands_prix", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	seasonId: integer("season_id").notNull().references(() => seasons.id, { onDelete: "cascade" } ),
	roundNumber: smallint("round_number").notNull(),
	eventName: text("event_name").notNull(),
	circuitKey: text("circuit_key"),
	eventFormat: text("event_format").default("conventional").notNull(),
	qualiDateUtc: timestamp("quali_date_utc", { withTimezone: true }),
	sprintQualiDateUtc: timestamp("sprint_quali_date_utc", { withTimezone: true }),
	sprintDateUtc: timestamp("sprint_date_utc", { withTimezone: true }),
	raceDateUtc: timestamp("race_date_utc", { withTimezone: true }),
	draftDeadlineUtc: timestamp("draft_deadline_utc", { withTimezone: true }),
	draftResetUtc: timestamp("draft_reset_utc", { withTimezone: true }),
	counterpickDeadlineUtc: timestamp("counterpick_deadline_utc", { withTimezone: true }),
	isCompleted: boolean("is_completed").default(false).notNull(),
}, (table) => [
	index("idx_grands_prix_completed").using("btree", table.seasonId.asc().nullsLast(), table.isCompleted.asc().nullsLast()),
	index("idx_grands_prix_season").using("btree", table.seasonId.asc().nullsLast()),
	unique("grands_prix_season_id_round_number_key").on(table.seasonId, table.roundNumber),]);

export const leagues = pgTable("leagues", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: text().notNull(),
	discordGuildId: bigint("discord_guild_id", { mode: 'number' }),
	seasonId: integer("season_id").notNull().references(() => seasons.id, { onDelete: "cascade" } ),
	embedColor: integer("embed_color").default(15135274).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	counterpickLimit: integer("counterpick_limit").default(3).notNull(),
	createdByPlayerId: integer("created_by_player_id").references(() => players.id, { onDelete: "set null" } ),  // ADD
	inviteCode: text("invite_code"),  // ADD
}, (table) => [
	index("idx_leagues_discord_guild").using("btree", table.discordGuildId.asc().nullsLast()),
	index("idx_leagues_season").using("btree", table.seasonId.asc().nullsLast()),
	index("idx_leagues_created_by").using("btree", table.createdByPlayerId.asc().nullsLast()),  // ADD
	index("idx_leagues_invite_code").using("btree", table.inviteCode.asc().nullsLast()),  // ADD
	unique("leagues_discord_guild_id_name_key").on(table.discordGuildId, table.name),
	unique("leagues_season_id_name_key").on(table.seasonId, table.name),
	unique("leagues_invite_code_key").on(table.inviteCode),  // ADD
]);

export const playerLeagues = pgTable("player_leagues", {
	playerId: integer("player_id").notNull().references(() => players.id, { onDelete: "cascade" } ),
	leagueId: integer("league_id").notNull().references(() => leagues.id, { onDelete: "cascade" } ),
	teamName: text("team_name"),
	teamMotto: text("team_motto"),
	joinedAt: timestamp("joined_at", { withTimezone: true }).default(sql`now()`).notNull(),
	role: text("role").default("member").notNull(),  // ADD: appended last — safe for existing bot repositories
}, (table) => [
	primaryKey({ columns: [table.playerId, table.leagueId], name: "player_leagues_pkey"}),
	index("idx_player_leagues_league").using("btree", table.leagueId.asc().nullsLast()),
	index("idx_player_leagues_player").using("btree", table.playerId.asc().nullsLast()),
	check("player_leagues_role_check", sql`(role = ANY (ARRAY['owner'::text, 'member'::text]))`),  // ADD
]);

export const playerRoundScores = pgTable("player_round_scores", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	playerId: integer("player_id").notNull().references(() => players.id, { onDelete: "cascade" } ),
	leagueId: integer("league_id").notNull().references(() => leagues.id, { onDelete: "cascade" } ),
	grandPrixId: integer("grand_prix_id").notNull().references(() => grandsPrix.id, { onDelete: "cascade" } ),
	totalPoints: integer("total_points").default(0).notNull(),
	breakdownJson: jsonb("breakdown_json").default({}).notNull(),
	calculatedAt: timestamp("calculated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_player_scores_gp_league").using("btree", table.grandPrixId.asc().nullsLast(), table.leagueId.asc().nullsLast()),
	index("idx_player_scores_player_league").using("btree", table.playerId.asc().nullsLast(), table.leagueId.asc().nullsLast()),
	unique("player_round_scores_player_id_league_id_grand_prix_id_key").on(table.playerId, table.leagueId, table.grandPrixId),]);

export const players = pgTable("players", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	discordUserId: bigint("discord_user_id", { mode: 'number' }),
	username: text().notNull(),
	password: varchar({ length: 255 }),
	timezone: text().default("UTC").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	email: text(),  // ADD: appended last — safe for existing bot repositories
}, (table) => [
	index("idx_players_discord_user").using("btree", table.discordUserId.asc().nullsLast()),
	index("idx_players_username").using("btree", table.username.asc().nullsLast()),
	index("idx_players_email").using("btree", table.email.asc().nullsLast()),  // ADD
	unique("players_discord_user_id_key").on(table.discordUserId),
	unique("players_username_key").on(table.username),
	unique("players_email_key").on(table.email),  // ADD
]);

export const raceResults = pgTable("race_results", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	grandPrixId: integer("grand_prix_id").notNull().references(() => grandsPrix.id, { onDelete: "cascade" } ),
	sessionType: text("session_type").notNull(),
	driverId: integer("driver_id").notNull().references(() => drivers.id),
	position: smallint().notNull(),
}, (table) => [
	index("idx_race_results_gp_session").using("btree", table.grandPrixId.asc().nullsLast(), table.sessionType.asc().nullsLast()),
	unique("race_results_grand_prix_id_session_type_driver_id_key").on(table.grandPrixId, table.sessionType, table.driverId),check("race_results_session_type_check", sql`(session_type = ANY (ARRAY['qualifying'::text, 'race'::text, 'sprint'::text, 'sprint_qualifying'::text]))`),]);

export const scoringRules = pgTable("scoring_rules", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	seasonId: integer("season_id").notNull().references(() => seasons.id, { onDelete: "cascade" } ),
	ruleKey: text("rule_key").notNull(),
	ruleValue: jsonb("rule_value").notNull(),
}, (table) => [
	index("idx_scoring_rules_season").using("btree", table.seasonId.asc().nullsLast()),
	unique("scoring_rules_season_id_rule_key_key").on(table.seasonId, table.ruleKey),]);

export const seasons = pgTable("seasons", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	year: smallint().notNull(),
	isActive: boolean("is_active").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	uniqueIndex("idx_seasons_active").using("btree", table.isActive.asc().nullsLast()).where(sql`(is_active = true)`),
	unique("seasons_year_key").on(table.year),]);
export const vDriverDraftStats = pgView("v_driver_draft_stats", {	driverId: integer("driver_id"),
	code: char({ length: 3 }),
	firstName: text("first_name"),
	lastName: text("last_name"),
	seasonId: integer("season_id"),
	leagueId: integer("league_id"),
	leagueName: text("league_name"),
	timesDraftedAsMain: bigint("times_drafted_as_main", { mode: 'number' }),
	timesDraftedAsBogey: bigint("times_drafted_as_bogey", { mode: 'number' }),
	totalTimesDrafted: bigint("total_times_drafted", { mode: 'number' }),
	uniquePlayersDraftedBy: bigint("unique_players_drafted_by", { mode: 'number' }),
}).as(sql`SELECT d.id AS driver_id, d.code, d.first_name, d.last_name, d.season_id, dr.league_id, l.name AS league_name, count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id THEN dr.id ELSE NULL::integer END) AS times_drafted_as_main, count(DISTINCT CASE WHEN dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END) AS times_drafted_as_bogey, count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END) AS total_times_drafted, count(DISTINCT dr.player_id) AS unique_players_drafted_by FROM drivers d LEFT JOIN drafts dr ON dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id LEFT JOIN leagues l ON l.id = dr.league_id GROUP BY d.id, d.code, d.first_name, d.last_name, d.season_id, dr.league_id, l.name ORDER BY (count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END)) DESC`);

export const vDriverDraftStatsSeason = pgView("v_driver_draft_stats_season", {	driverId: integer("driver_id"),
	code: char({ length: 3 }),
	firstName: text("first_name"),
	lastName: text("last_name"),
	seasonId: integer("season_id"),
	seasonYear: smallint("season_year"),
	timesDraftedAsMain: bigint("times_drafted_as_main", { mode: 'number' }),
	timesDraftedAsBogey: bigint("times_drafted_as_bogey", { mode: 'number' }),
	totalTimesDrafted: bigint("total_times_drafted", { mode: 'number' }),
	uniquePlayersDraftedBy: bigint("unique_players_drafted_by", { mode: 'number' }),
	leaguesDraftedIn: bigint("leagues_drafted_in", { mode: 'number' }),
}).as(sql`SELECT d.id AS driver_id, d.code, d.first_name, d.last_name, d.season_id, s.year AS season_year, count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id THEN dr.id ELSE NULL::integer END) AS times_drafted_as_main, count(DISTINCT CASE WHEN dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END) AS times_drafted_as_bogey, count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END) AS total_times_drafted, count(DISTINCT dr.player_id) AS unique_players_drafted_by, count(DISTINCT dr.league_id) AS leagues_drafted_in FROM drivers d JOIN seasons s ON s.id = d.season_id LEFT JOIN drafts dr ON dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id GROUP BY d.id, d.code, d.first_name, d.last_name, d.season_id, s.year ORDER BY (count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END)) DESC`);

export const vGrandPrixLeaderboard = pgView("v_grand_prix_leaderboard", {	leagueId: integer("league_id"),
	leagueName: text("league_name"),
	grandPrixId: integer("grand_prix_id"),
	eventName: text("event_name"),
	roundNumber: smallint("round_number"),
	playerId: integer("player_id"),
	username: text(),
	teamName: text("team_name"),
	totalPoints: integer("total_points"),
	breakdownJson: jsonb("breakdown_json"),
	rank: bigint({ mode: 'number' }),
}).as(sql`SELECT prs.league_id, l.name AS league_name, gp.id AS grand_prix_id, gp.event_name, gp.round_number, p.id AS player_id, p.username, pl.team_name, prs.total_points, prs.breakdown_json, rank() OVER (PARTITION BY prs.league_id, gp.id ORDER BY prs.total_points DESC) AS rank FROM player_round_scores prs JOIN players p ON p.id = prs.player_id JOIN player_leagues pl ON pl.player_id = p.id AND pl.league_id = prs.league_id JOIN leagues l ON l.id = prs.league_id JOIN grands_prix gp ON gp.id = prs.grand_prix_id ORDER BY prs.league_id, gp.round_number, prs.total_points DESC`);

export const vLeagueLeaderboard = pgView("v_league_leaderboard", {	leagueId: integer("league_id"),
	leagueName: text("league_name"),
	seasonId: integer("season_id"),
	playerId: integer("player_id"),
	username: text(),
	teamName: text("team_name"),
	totalPoints: bigint("total_points", { mode: 'number' }),
	roundsPlayed: bigint("rounds_played", { mode: 'number' }),
	rank: bigint({ mode: 'number' }),
}).as(sql`SELECT pl.league_id, l.name AS league_name, l.season_id, p.id AS player_id, p.username, pl.team_name, COALESCE(sum(prs.total_points), 0::bigint) AS total_points, count(DISTINCT prs.grand_prix_id) AS rounds_played, rank() OVER (PARTITION BY pl.league_id ORDER BY (COALESCE(sum(prs.total_points), 0::bigint)) DESC) AS rank FROM player_leagues pl JOIN players p ON p.id = pl.player_id JOIN leagues l ON l.id = pl.league_id LEFT JOIN player_round_scores prs ON prs.player_id = p.id AND prs.league_id = pl.league_id LEFT JOIN grands_prix gp ON gp.id = prs.grand_prix_id AND gp.season_id = l.season_id GROUP BY pl.league_id, l.name, l.season_id, p.id, p.username, pl.team_name ORDER BY pl.league_id, (COALESCE(sum(prs.total_points), 0::bigint)) DESC`);

export const vLeagueSummary = pgView("v_league_summary", {	leagueId: integer("league_id"),
	leagueName: text("league_name"),
	discordGuildId: bigint("discord_guild_id", { mode: 'number' }),
	seasonId: integer("season_id"),
	seasonYear: smallint("season_year"),
	playerCount: bigint("player_count", { mode: 'number' }),
	totalScoresSubmitted: bigint("total_scores_submitted", { mode: 'number' }),
	completedRounds: bigint("completed_rounds", { mode: 'number' }),
	totalRounds: bigint("total_rounds", { mode: 'number' }),
	createdAt: timestamp("created_at", { withTimezone: true }),
}).as(sql`SELECT l.id AS league_id, l.name AS league_name, l.discord_guild_id, l.season_id, s.year AS season_year, count(DISTINCT pl.player_id) AS player_count, count(DISTINCT prs.id) AS total_scores_submitted, count(DISTINCT gp.id) FILTER (WHERE gp.is_completed) AS completed_rounds, count(DISTINCT gp.id) AS total_rounds, l.created_at FROM leagues l JOIN seasons s ON s.id = l.season_id LEFT JOIN player_leagues pl ON pl.league_id = l.id LEFT JOIN grands_prix gp ON gp.season_id = l.season_id LEFT JOIN player_round_scores prs ON prs.league_id = l.id AND prs.grand_prix_id = gp.id GROUP BY l.id, l.name, l.discord_guild_id, l.season_id, s.year, l.created_at ORDER BY l.created_at DESC`);

export const vPlayerLeagueStats = pgView("v_player_league_stats", {	playerId: integer("player_id"),
	username: text(),
	teamName: text("team_name"),
	leagueId: integer("league_id"),
	leagueName: text("league_name"),
	seasonId: integer("season_id"),
	roundsParticipated: bigint("rounds_participated", { mode: 'number' }),
	totalCompletedRounds: bigint("total_completed_rounds", { mode: 'number' }),
	totalPoints: bigint("total_points", { mode: 'number' }),
	avgPointsPerRound: numeric("avg_points_per_round"),
	bestRoundScore: integer("best_round_score"),
	worstRoundScore: integer("worst_round_score"),
	currentRank: bigint("current_rank", { mode: 'number' }),
}).as(sql`SELECT p.id AS player_id, p.username, pl.team_name, pl.league_id, l.name AS league_name, l.season_id, count(DISTINCT prs.grand_prix_id) AS rounds_participated, count(DISTINCT gp.id) FILTER (WHERE gp.is_completed) AS total_completed_rounds, COALESCE(sum(prs.total_points), 0::bigint) AS total_points, COALESCE(avg(prs.total_points), 0::numeric) AS avg_points_per_round, COALESCE(max(prs.total_points), 0) AS best_round_score, COALESCE(min(prs.total_points), 0) AS worst_round_score, rank() OVER (PARTITION BY pl.league_id ORDER BY (COALESCE(sum(prs.total_points), 0::bigint)) DESC) AS current_rank FROM players p JOIN player_leagues pl ON pl.player_id = p.id JOIN leagues l ON l.id = pl.league_id LEFT JOIN grands_prix gp ON gp.season_id = l.season_id LEFT JOIN player_round_scores prs ON prs.player_id = p.id AND prs.league_id = pl.league_id AND prs.grand_prix_id = gp.id GROUP BY p.id, p.username, pl.team_name, pl.league_id, l.name, l.season_id`);

export const vPlayerLeagues = pgView("v_player_leagues", {	playerId: integer("player_id"),
	username: text(),
	discordUserId: bigint("discord_user_id", { mode: 'number' }),
	leagueId: integer("league_id"),
	leagueName: text("league_name"),
	seasonId: integer("season_id"),
	seasonYear: smallint("season_year"),
	joinedAt: timestamp("joined_at", { withTimezone: true }),
	roundsPlayedInLeague: bigint("rounds_played_in_league", { mode: 'number' }),
	totalPointsInLeague: bigint("total_points_in_league", { mode: 'number' }),
}).as(sql`SELECT p.id AS player_id, p.username, p.discord_user_id, pl.league_id, l.name AS league_name, l.season_id, s.year AS season_year, pl.joined_at, count(DISTINCT prs.id) AS rounds_played_in_league, COALESCE(sum(prs.total_points), 0::bigint) AS total_points_in_league FROM players p JOIN player_leagues pl ON pl.player_id = p.id JOIN leagues l ON l.id = pl.league_id JOIN seasons s ON s.id = l.season_id LEFT JOIN player_round_scores prs ON prs.player_id = p.id AND prs.league_id = pl.league_id LEFT JOIN grands_prix gp ON gp.id = prs.grand_prix_id AND gp.season_id = l.season_id GROUP BY p.id, p.username, p.discord_user_id, pl.league_id, l.name, l.season_id, s.year, pl.joined_at ORDER BY p.id, pl.joined_at DESC`);

export const vPlayerSeasonDetail = pgView("v_player_season_detail", {	leagueId: integer("league_id"),
	leagueName: text("league_name"),
	seasonId: integer("season_id"),
	playerId: integer("player_id"),
	username: text(),
	teamName: text("team_name"),
	roundNumber: smallint("round_number"),
	eventName: text("event_name"),
	isCompleted: boolean("is_completed"),
	totalPoints: integer("total_points"),
	breakdownJson: jsonb("breakdown_json"),
	calculatedAt: timestamp("calculated_at", { withTimezone: true }),
	driver1Code: char("driver1_code", { length: 3 }),
	driver2Code: char("driver2_code", { length: 3 }),
	driver3Code: char("driver3_code", { length: 3 }),
	wildcardCode: char("wildcard_code", { length: 3 }),
	constructor: text(),
}).as(sql`SELECT pl.league_id, l.name AS league_name, l.season_id, p.id AS player_id, p.username, pl.team_name, gp.round_number, gp.event_name, gp.is_completed, prs.total_points, prs.breakdown_json, prs.calculated_at, d.driver1_code, d.driver2_code, d.driver3_code, d.wildcard_code, c.short_name AS constructor FROM player_leagues pl JOIN players p ON p.id = pl.player_id JOIN leagues l ON l.id = pl.league_id JOIN grands_prix gp ON gp.season_id = l.season_id LEFT JOIN player_round_scores prs ON prs.player_id = p.id AND prs.league_id = pl.league_id AND prs.grand_prix_id = gp.id LEFT JOIN LATERAL ( SELECT dr1.code AS driver1_code, dr2.code AS driver2_code, dr3.code AS driver3_code, dr4.code AS wildcard_code, drafts.constructor_id FROM drafts JOIN drivers dr1 ON dr1.id = drafts.driver1_id JOIN drivers dr2 ON dr2.id = drafts.driver2_id JOIN drivers dr3 ON dr3.id = drafts.driver3_id JOIN drivers dr4 ON dr4.id = drafts.wildcard_id WHERE drafts.player_id = p.id AND drafts.league_id = pl.league_id AND drafts.grand_prix_id = gp.id LIMIT 1) d ON true LEFT JOIN constructors c ON c.id = d.constructor_id ORDER BY pl.league_id, p.id, gp.round_number`);