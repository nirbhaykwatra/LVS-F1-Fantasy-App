import { pgTable, index, foreignKey, unique, integer, smallint, text, timestamp, boolean, char, date, check, jsonb, bigint, uniqueIndex, varchar, primaryKey, pgView, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const grandsPrix = pgTable("grands_prix", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "grands_prix_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	seasonId: integer("season_id").notNull(),
	roundNumber: smallint("round_number").notNull(),
	eventName: text("event_name").notNull(),
	circuitKey: text("circuit_key"),
	eventFormat: text("event_format").default('conventional').notNull(),
	qualiDateUtc: timestamp("quali_date_utc", { withTimezone: true, mode: 'string' }),
	sprintQualiDateUtc: timestamp("sprint_quali_date_utc", { withTimezone: true, mode: 'string' }),
	sprintDateUtc: timestamp("sprint_date_utc", { withTimezone: true, mode: 'string' }),
	raceDateUtc: timestamp("race_date_utc", { withTimezone: true, mode: 'string' }),
	draftDeadlineUtc: timestamp("draft_deadline_utc", { withTimezone: true, mode: 'string' }),
	draftResetUtc: timestamp("draft_reset_utc", { withTimezone: true, mode: 'string' }),
	counterpickDeadlineUtc: timestamp("counterpick_deadline_utc", { withTimezone: true, mode: 'string' }),
	isCompleted: boolean("is_completed").default(false).notNull(),
}, (table) => [
	index("idx_grands_prix_completed").using("btree", table.seasonId.asc().nullsLast().op("int4_ops"), table.isCompleted.asc().nullsLast().op("int4_ops")),
	index("idx_grands_prix_season").using("btree", table.seasonId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.seasonId],
			foreignColumns: [seasons.id],
			name: "grands_prix_season_id_fkey"
		}).onDelete("cascade"),
	unique("grands_prix_season_id_round_number_key").on(table.roundNumber, table.seasonId),
]);

export const drivers = pgTable("drivers", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "drivers_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	seasonId: integer("season_id").notNull(),
	code: char({ length: 3 }).notNull(),
	number: smallint().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	constructorId: integer("constructor_id").notNull(),
	ergastId: text("ergast_id"),
	isActive: boolean("is_active").default(true).notNull(),
	dateOfBirth: date("date_of_birth"),
	nationality: text(),
	driverImageUrl: text("driver_image_url"),
}, (table) => [
	index("idx_drivers_constructor").using("btree", table.constructorId.asc().nullsLast().op("int4_ops")),
	index("idx_drivers_season").using("btree", table.seasonId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.constructorId],
			foreignColumns: [constructors.id],
			name: "drivers_constructor_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.seasonId],
			foreignColumns: [seasons.id],
			name: "drivers_season_id_fkey"
		}).onDelete("cascade"),
	unique("drivers_season_id_code_number_key").on(table.code, table.number, table.seasonId),
]);

export const drafts = pgTable("drafts", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "drafts_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	playerId: integer("player_id").notNull(),
	leagueId: integer("league_id").notNull(),
	grandPrixId: integer("grand_prix_id").notNull(),
	driver1Id: integer("driver1_id").notNull(),
	driver2Id: integer("driver2_id").notNull(),
	driver3Id: integer("driver3_id").notNull(),
	wildcardId: integer("wildcard_id").notNull(),
	constructorId: integer("constructor_id").notNull(),
	isAutoAssigned: boolean("is_auto_assigned").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_drafts_grand_prix_league").using("btree", table.grandPrixId.asc().nullsLast().op("int4_ops"), table.leagueId.asc().nullsLast().op("int4_ops")),
	index("idx_drafts_player_league").using("btree", table.playerId.asc().nullsLast().op("int4_ops"), table.leagueId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.constructorId],
			foreignColumns: [constructors.id],
			name: "drafts_constructor_id_fkey"
		}),
	foreignKey({
			columns: [table.driver1Id],
			foreignColumns: [drivers.id],
			name: "drafts_driver1_id_fkey"
		}),
	foreignKey({
			columns: [table.driver2Id],
			foreignColumns: [drivers.id],
			name: "drafts_driver2_id_fkey"
		}),
	foreignKey({
			columns: [table.driver3Id],
			foreignColumns: [drivers.id],
			name: "drafts_driver3_id_fkey"
		}),
	foreignKey({
			columns: [table.grandPrixId],
			foreignColumns: [grandsPrix.id],
			name: "drafts_grand_prix_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.leagueId],
			foreignColumns: [leagues.id],
			name: "drafts_league_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.id],
			name: "drafts_player_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.wildcardId],
			foreignColumns: [drivers.id],
			name: "drafts_wildcard_id_fkey"
		}),
	unique("drafts_player_id_league_id_grand_prix_id_key").on(table.grandPrixId, table.leagueId, table.playerId),
	check("drafts_check", sql`(driver1_id <> driver2_id) AND (driver1_id <> driver3_id) AND (driver1_id <> wildcard_id) AND (driver2_id <> driver3_id) AND (driver2_id <> wildcard_id) AND (driver3_id <> wildcard_id)`),
]);

export const constructors = pgTable("constructors", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "constructors_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	seasonId: integer("season_id").notNull(),
	shortName: text("short_name").notNull(),
	fullName: text("full_name").notNull(),
	colorHex: char("color_hex", { length: 7 }).default('#FFFFFF').notNull(),
	ergastId: text("ergast_id"),
}, (table) => [
	index("idx_constructors_season").using("btree", table.seasonId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.seasonId],
			foreignColumns: [seasons.id],
			name: "constructors_season_id_fkey"
		}).onDelete("cascade"),
	unique("constructors_season_id_short_name_key").on(table.seasonId, table.shortName),
]);

export const driverExhaustion = pgTable("driver_exhaustion", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "driver_exhaustion_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	playerId: integer("player_id").notNull(),
	leagueId: integer("league_id").notNull(),
	driverId: integer("driver_id").notNull(),
	lastGrandPrixId: integer("last_grand_prix_id").notNull(),
	consecutiveUses: integer("consecutive_uses").default(1).notNull(),
	isExhausted: boolean("is_exhausted").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_driver_exhaustion_driver").using("btree", table.driverId.asc().nullsLast().op("int4_ops")),
	index("idx_driver_exhaustion_exhausted").using("btree", table.playerId.asc().nullsLast().op("int4_ops"), table.leagueId.asc().nullsLast().op("int4_ops")).where(sql`(is_exhausted = true)`),
	index("idx_driver_exhaustion_player_league").using("btree", table.playerId.asc().nullsLast().op("int4_ops"), table.leagueId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.driverId],
			foreignColumns: [drivers.id],
			name: "driver_exhaustion_driver_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.lastGrandPrixId],
			foreignColumns: [grandsPrix.id],
			name: "driver_exhaustion_last_grand_prix_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.leagueId],
			foreignColumns: [leagues.id],
			name: "driver_exhaustion_league_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.id],
			name: "driver_exhaustion_player_id_fkey"
		}).onDelete("cascade"),
	unique("driver_exhaustion_player_id_league_id_driver_id_key").on(table.driverId, table.leagueId, table.playerId),
	check("driver_exhaustion_consecutive_uses_check", sql`consecutive_uses >= 0`),
]);

export const playerRoundScores = pgTable("player_round_scores", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "player_round_scores_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	playerId: integer("player_id").notNull(),
	leagueId: integer("league_id").notNull(),
	grandPrixId: integer("grand_prix_id").notNull(),
	totalPoints: integer("total_points").default(0).notNull(),
	breakdownJson: jsonb("breakdown_json").default({}).notNull(),
	calculatedAt: timestamp("calculated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_player_scores_gp_league").using("btree", table.grandPrixId.asc().nullsLast().op("int4_ops"), table.leagueId.asc().nullsLast().op("int4_ops")),
	index("idx_player_scores_player_league").using("btree", table.playerId.asc().nullsLast().op("int4_ops"), table.leagueId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.grandPrixId],
			foreignColumns: [grandsPrix.id],
			name: "player_round_scores_grand_prix_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.leagueId],
			foreignColumns: [leagues.id],
			name: "player_round_scores_league_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.id],
			name: "player_round_scores_player_id_fkey"
		}).onDelete("cascade"),
	unique("player_round_scores_player_id_league_id_grand_prix_id_key").on(table.grandPrixId, table.leagueId, table.playerId),
]);

export const raceResults = pgTable("race_results", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "race_results_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	grandPrixId: integer("grand_prix_id").notNull(),
	sessionType: text("session_type").notNull(),
	driverId: integer("driver_id").notNull(),
	position: smallint().notNull(),
}, (table) => [
	index("idx_race_results_gp_session").using("btree", table.grandPrixId.asc().nullsLast().op("text_ops"), table.sessionType.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.driverId],
			foreignColumns: [drivers.id],
			name: "race_results_driver_id_fkey"
		}),
	foreignKey({
			columns: [table.grandPrixId],
			foreignColumns: [grandsPrix.id],
			name: "race_results_grand_prix_id_fkey"
		}).onDelete("cascade"),
	unique("race_results_grand_prix_id_session_type_driver_id_key").on(table.driverId, table.grandPrixId, table.sessionType),
	check("race_results_session_type_check", sql`session_type = ANY (ARRAY['qualifying'::text, 'race'::text, 'sprint'::text, 'sprint_qualifying'::text])`),
]);

// TODO: Maybe add a UUID column for leagues or just use the invite code...?
export const leagues = pgTable("leagues", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "leagues_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	discordGuildId: bigint("discord_guild_id", { mode: "number" }),
	seasonId: integer("season_id").notNull(),
	embedColor: integer("embed_color").default(15135274).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	counterpickLimit: integer("counterpick_limit").default(3).notNull(),
	createdByPlayerId: integer("created_by_player_id"),
	inviteCode: text("invite_code"),
}, (table) => [
	index("idx_leagues_created_by").using("btree", table.createdByPlayerId.asc().nullsLast().op("int4_ops")),
	index("idx_leagues_discord_guild").using("btree", table.discordGuildId.asc().nullsLast().op("int8_ops")),
	index("idx_leagues_invite_code").using("btree", table.inviteCode.asc().nullsLast().op("text_ops")),
	index("idx_leagues_season").using("btree", table.seasonId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.seasonId],
			foreignColumns: [seasons.id],
			name: "leagues_season_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdByPlayerId],
			foreignColumns: [players.id],
			name: "leagues_created_by_player_id_fkey"
		}).onDelete("set null"),
	unique("leagues_discord_guild_id_name_key").on(table.discordGuildId, table.name),
	unique("leagues_season_id_name_key").on(table.name, table.seasonId),
	unique("leagues_invite_code_key").on(table.inviteCode),
]);

export const counterpicks = pgTable("counterpicks", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "counterpicks_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	grandPrixId: integer("grand_prix_id").notNull(),
	leagueId: integer("league_id").notNull(),
	pickingPlayerId: integer("picking_player_id").notNull(),
	targetPlayerId: integer("target_player_id").notNull(),
	targetDriverId: integer("target_driver_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_counterpicks_grand_prix_league").using("btree", table.grandPrixId.asc().nullsLast().op("int4_ops"), table.leagueId.asc().nullsLast().op("int4_ops")),
	index("idx_counterpicks_target").using("btree", table.grandPrixId.asc().nullsLast().op("int4_ops"), table.leagueId.asc().nullsLast().op("int4_ops"), table.targetPlayerId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.grandPrixId],
			foreignColumns: [grandsPrix.id],
			name: "counterpicks_grand_prix_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.leagueId],
			foreignColumns: [leagues.id],
			name: "counterpicks_league_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.pickingPlayerId],
			foreignColumns: [players.id],
			name: "counterpicks_picking_player_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.targetDriverId],
			foreignColumns: [drivers.id],
			name: "counterpicks_target_driver_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.targetPlayerId],
			foreignColumns: [players.id],
			name: "counterpicks_target_player_id_fkey"
		}).onDelete("cascade"),
	unique("counterpicks_grand_prix_id_league_id_picking_player_id_key").on(table.grandPrixId, table.leagueId, table.pickingPlayerId),
	check("counterpicks_check", sql`picking_player_id <> target_player_id`),
]);

export const scoringRules = pgTable("scoring_rules", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "scoring_rules_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	seasonId: integer("season_id").notNull(),
	ruleKey: text("rule_key").notNull(),
	ruleValue: jsonb("rule_value").notNull(),
}, (table) => [
	index("idx_scoring_rules_season").using("btree", table.seasonId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.seasonId],
			foreignColumns: [seasons.id],
			name: "scoring_rules_season_id_fkey"
		}).onDelete("cascade"),
	unique("scoring_rules_season_id_rule_key_key").on(table.ruleKey, table.seasonId),
]);

export const constructorExhaustion = pgTable("constructor_exhaustion", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "constructor_exhaustion_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	playerId: integer("player_id").notNull(),
	leagueId: integer("league_id").notNull(),
	constructorId: integer("constructor_id").notNull(),
	lastGrandPrixId: integer("last_grand_prix_id").notNull(),
	consecutiveUses: integer("consecutive_uses").default(1).notNull(),
	isExhausted: boolean("is_exhausted").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_constructor_exhaustion_constructor").using("btree", table.constructorId.asc().nullsLast().op("int4_ops")),
	index("idx_constructor_exhaustion_exhausted").using("btree", table.playerId.asc().nullsLast().op("int4_ops"), table.leagueId.asc().nullsLast().op("int4_ops")).where(sql`(is_exhausted = true)`),
	index("idx_constructor_exhaustion_player_league").using("btree", table.playerId.asc().nullsLast().op("int4_ops"), table.leagueId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.constructorId],
			foreignColumns: [constructors.id],
			name: "constructor_exhaustion_constructor_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.lastGrandPrixId],
			foreignColumns: [grandsPrix.id],
			name: "constructor_exhaustion_last_grand_prix_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.leagueId],
			foreignColumns: [leagues.id],
			name: "constructor_exhaustion_league_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.id],
			name: "constructor_exhaustion_player_id_fkey"
		}).onDelete("cascade"),
	unique("constructor_exhaustion_player_id_league_id_constructor_id_key").on(table.constructorId, table.leagueId, table.playerId),
	check("constructor_exhaustion_consecutive_uses_check", sql`consecutive_uses >= 0`),
]);

export const seasons = pgTable("seasons", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "seasons_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	year: smallint().notNull(),
	isActive: boolean("is_active").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("idx_seasons_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")).where(sql`(is_active = true)`),
	unique("seasons_year_key").on(table.year),
]);

// TODO: Maybe add a UUID for players
export const players = pgTable("players", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "players_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	discordUserId: bigint("discord_user_id", { mode: "number" }),
	username: text().notNull(),
	password: varchar({ length: 255 }),
	timezone: text().default('UTC').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	email: text(),
}, (table) => [
	index("idx_players_discord_user").using("btree", table.discordUserId.asc().nullsLast().op("int8_ops")),
	index("idx_players_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("idx_players_username").using("btree", table.username.asc().nullsLast().op("text_ops")),
	unique("players_discord_user_id_key").on(table.discordUserId),
	unique("players_username_key").on(table.username),
	unique("players_email_key").on(table.email),
]);

export const counterpickUsage = pgTable("counterpick_usage", {
	playerId: integer("player_id").notNull(),
	leagueId: integer("league_id").notNull(),
	seasonId: integer("season_id").notNull(),
	usedCount: integer("used_count").default(0).notNull(),
}, (table) => [
	index("idx_counterpick_usage_player_league").using("btree", table.playerId.asc().nullsLast().op("int4_ops"), table.leagueId.asc().nullsLast().op("int4_ops")),
	index("idx_counterpick_usage_season").using("btree", table.seasonId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.leagueId],
			foreignColumns: [leagues.id],
			name: "counterpick_usage_league_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.id],
			name: "counterpick_usage_player_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.seasonId],
			foreignColumns: [seasons.id],
			name: "counterpick_usage_season_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.leagueId, table.playerId, table.seasonId], name: "counterpick_usage_pkey"}),
	check("counterpick_usage_used_count_check", sql`used_count >= 0`),
]);

export const playerLeagues = pgTable("player_leagues", {
	playerId: integer("player_id").notNull(),
	leagueId: integer("league_id").notNull(),
	teamName: text("team_name"),
	teamMotto: text("team_motto"),
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	role: text().default('member').notNull(),
}, (table) => [
	index("idx_player_leagues_league").using("btree", table.leagueId.asc().nullsLast().op("int4_ops")),
	index("idx_player_leagues_player").using("btree", table.playerId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.leagueId],
			foreignColumns: [leagues.id],
			name: "player_leagues_league_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.id],
			name: "player_leagues_player_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.leagueId, table.playerId], name: "player_leagues_pkey"}),
	check("player_leagues_role_check", sql`role = ANY (ARRAY['owner'::text, 'member'::text])`),
]);
export const vDriverDraftStats = pgView("v_driver_draft_stats", {	driverId: integer("driver_id"),
	code: char({ length: 3 }),
	firstName: text("first_name"),
	lastName: text("last_name"),
	seasonId: integer("season_id"),
	leagueId: integer("league_id"),
	leagueName: text("league_name"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timesDraftedAsMain: bigint("times_drafted_as_main", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timesDraftedAsBogey: bigint("times_drafted_as_bogey", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalTimesDrafted: bigint("total_times_drafted", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	uniquePlayersDraftedBy: bigint("unique_players_drafted_by", { mode: "number" }),
}).as(sql`SELECT d.id AS driver_id, d.code, d.first_name, d.last_name, d.season_id, dr.league_id, l.name AS league_name, count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id THEN dr.id ELSE NULL::integer END) AS times_drafted_as_main, count(DISTINCT CASE WHEN dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END) AS times_drafted_as_bogey, count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END) AS total_times_drafted, count(DISTINCT dr.player_id) AS unique_players_drafted_by FROM drivers d LEFT JOIN drafts dr ON dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id LEFT JOIN leagues l ON l.id = dr.league_id GROUP BY d.id, d.code, d.first_name, d.last_name, d.season_id, dr.league_id, l.name ORDER BY (count(DISTINCT CASE WHEN dr.driver1_id = d.id OR dr.driver2_id = d.id OR dr.driver3_id = d.id OR dr.wildcard_id = d.id THEN dr.id ELSE NULL::integer END)) DESC`);

export const vDriverDraftStatsSeason = pgView("v_driver_draft_stats_season", {	driverId: integer("driver_id"),
	code: char({ length: 3 }),
	firstName: text("first_name"),
	lastName: text("last_name"),
	seasonId: integer("season_id"),
	seasonYear: smallint("season_year"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timesDraftedAsMain: bigint("times_drafted_as_main", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timesDraftedAsBogey: bigint("times_drafted_as_bogey", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalTimesDrafted: bigint("total_times_drafted", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	uniquePlayersDraftedBy: bigint("unique_players_drafted_by", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	leaguesDraftedIn: bigint("leagues_drafted_in", { mode: "number" }),
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
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	rank: bigint({ mode: "number" }),
}).as(sql`SELECT prs.league_id, l.name AS league_name, gp.id AS grand_prix_id, gp.event_name, gp.round_number, p.id AS player_id, p.username, pl.team_name, prs.total_points, prs.breakdown_json, rank() OVER (PARTITION BY prs.league_id, gp.id ORDER BY prs.total_points DESC) AS rank FROM player_round_scores prs JOIN players p ON p.id = prs.player_id JOIN player_leagues pl ON pl.player_id = p.id AND pl.league_id = prs.league_id JOIN leagues l ON l.id = prs.league_id JOIN grands_prix gp ON gp.id = prs.grand_prix_id ORDER BY prs.league_id, gp.round_number, prs.total_points DESC`);

export const vPlayerLeagueStats = pgView("v_player_league_stats", {	playerId: integer("player_id"),
	username: text(),
	teamName: text("team_name"),
	leagueId: integer("league_id"),
	leagueName: text("league_name"),
	seasonId: integer("season_id"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roundsParticipated: bigint("rounds_participated", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCompletedRounds: bigint("total_completed_rounds", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalPoints: bigint("total_points", { mode: "number" }),
	avgPointsPerRound: numeric("avg_points_per_round"),
	bestRoundScore: integer("best_round_score"),
	worstRoundScore: integer("worst_round_score"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	currentRank: bigint("current_rank", { mode: "number" }),
}).as(sql`SELECT p.id AS player_id, p.username, pl.team_name, pl.league_id, l.name AS league_name, l.season_id, count(DISTINCT prs.grand_prix_id) AS rounds_participated, count(DISTINCT gp.id) FILTER (WHERE gp.is_completed) AS total_completed_rounds, COALESCE(sum(prs.total_points), 0::bigint) AS total_points, COALESCE(avg(prs.total_points), 0::numeric) AS avg_points_per_round, COALESCE(max(prs.total_points), 0) AS best_round_score, COALESCE(min(prs.total_points), 0) AS worst_round_score, rank() OVER (PARTITION BY pl.league_id ORDER BY (COALESCE(sum(prs.total_points), 0::bigint)) DESC) AS current_rank FROM players p JOIN player_leagues pl ON pl.player_id = p.id JOIN leagues l ON l.id = pl.league_id LEFT JOIN grands_prix gp ON gp.season_id = l.season_id LEFT JOIN player_round_scores prs ON prs.player_id = p.id AND prs.league_id = pl.league_id AND prs.grand_prix_id = gp.id GROUP BY p.id, p.username, pl.team_name, pl.league_id, l.name, l.season_id`);

export const vLeagueLeaderboard = pgView("v_league_leaderboard", {	leagueId: integer("league_id"),
	leagueName: text("league_name"),
	seasonId: integer("season_id"),
	playerId: integer("player_id"),
	username: text(),
	teamName: text("team_name"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalPoints: bigint("total_points", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roundsPlayed: bigint("rounds_played", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	rank: bigint({ mode: "number" }),
}).as(sql`SELECT pl.league_id, l.name AS league_name, l.season_id, p.id AS player_id, p.username, pl.team_name, COALESCE(sum(prs.total_points), 0::bigint) AS total_points, count(DISTINCT prs.grand_prix_id) AS rounds_played, rank() OVER (PARTITION BY pl.league_id ORDER BY (COALESCE(sum(prs.total_points), 0::bigint)) DESC) AS rank FROM player_leagues pl JOIN players p ON p.id = pl.player_id JOIN leagues l ON l.id = pl.league_id LEFT JOIN player_round_scores prs ON prs.player_id = p.id AND prs.league_id = pl.league_id LEFT JOIN grands_prix gp ON gp.id = prs.grand_prix_id AND gp.season_id = l.season_id GROUP BY pl.league_id, l.name, l.season_id, p.id, p.username, pl.team_name ORDER BY pl.league_id, (COALESCE(sum(prs.total_points), 0::bigint)) DESC`);

export const vLeagueSummary = pgView("v_league_summary", {	leagueId: integer("league_id"),
	leagueName: text("league_name"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	discordGuildId: bigint("discord_guild_id", { mode: "number" }),
	seasonId: integer("season_id"),
	seasonYear: smallint("season_year"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	playerCount: bigint("player_count", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalScoresSubmitted: bigint("total_scores_submitted", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	completedRounds: bigint("completed_rounds", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalRounds: bigint("total_rounds", { mode: "number" }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
}).as(sql`SELECT l.id AS league_id, l.name AS league_name, l.discord_guild_id, l.season_id, s.year AS season_year, count(DISTINCT pl.player_id) AS player_count, count(DISTINCT prs.id) AS total_scores_submitted, count(DISTINCT gp.id) FILTER (WHERE gp.is_completed) AS completed_rounds, count(DISTINCT gp.id) AS total_rounds, l.created_at FROM leagues l JOIN seasons s ON s.id = l.season_id LEFT JOIN player_leagues pl ON pl.league_id = l.id LEFT JOIN grands_prix gp ON gp.season_id = l.season_id LEFT JOIN player_round_scores prs ON prs.league_id = l.id AND prs.grand_prix_id = gp.id GROUP BY l.id, l.name, l.discord_guild_id, l.season_id, s.year, l.created_at ORDER BY l.created_at DESC`);

export const vPlayerLeagues = pgView("v_player_leagues", {	playerId: integer("player_id"),
	username: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	discordUserId: bigint("discord_user_id", { mode: "number" }),
	leagueId: integer("league_id"),
	leagueName: text("league_name"),
	seasonId: integer("season_id"),
	seasonYear: smallint("season_year"),
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roundsPlayedInLeague: bigint("rounds_played_in_league", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalPointsInLeague: bigint("total_points_in_league", { mode: "number" }),
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
	calculatedAt: timestamp("calculated_at", { withTimezone: true, mode: 'string' }),
	driver1Code: char("driver1_code", { length: 3 }),
	driver2Code: char("driver2_code", { length: 3 }),
	driver3Code: char("driver3_code", { length: 3 }),
	wildcardCode: char("wildcard_code", { length: 3 }),
	constructor: text(),
}).as(sql`SELECT pl.league_id, l.name AS league_name, l.season_id, p.id AS player_id, p.username, pl.team_name, gp.round_number, gp.event_name, gp.is_completed, prs.total_points, prs.breakdown_json, prs.calculated_at, d.driver1_code, d.driver2_code, d.driver3_code, d.wildcard_code, c.short_name AS constructor FROM player_leagues pl JOIN players p ON p.id = pl.player_id JOIN leagues l ON l.id = pl.league_id JOIN grands_prix gp ON gp.season_id = l.season_id LEFT JOIN player_round_scores prs ON prs.player_id = p.id AND prs.league_id = pl.league_id AND prs.grand_prix_id = gp.id LEFT JOIN LATERAL ( SELECT dr1.code AS driver1_code, dr2.code AS driver2_code, dr3.code AS driver3_code, dr4.code AS wildcard_code, drafts.constructor_id FROM drafts JOIN drivers dr1 ON dr1.id = drafts.driver1_id JOIN drivers dr2 ON dr2.id = drafts.driver2_id JOIN drivers dr3 ON dr3.id = drafts.driver3_id JOIN drivers dr4 ON dr4.id = drafts.wildcard_id WHERE drafts.player_id = p.id AND drafts.league_id = pl.league_id AND drafts.grand_prix_id = gp.id LIMIT 1) d ON true LEFT JOIN constructors c ON c.id = d.constructor_id ORDER BY pl.league_id, p.id, gp.round_number`);