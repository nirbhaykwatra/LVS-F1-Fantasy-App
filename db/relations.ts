import { relations } from "drizzle-orm/relations";
import { seasons, grandsPrix, constructors, drivers, drafts, leagues, players, driverExhaustion, playerRoundScores, raceResults, counterpicks, scoringRules, constructorExhaustion, counterpickUsage, playerLeagues } from "./schema";

export const grandsPrixRelations = relations(grandsPrix, ({one, many}) => ({
	season: one(seasons, {
		fields: [grandsPrix.seasonId],
		references: [seasons.id]
	}),
	drafts: many(drafts),
	driverExhaustions: many(driverExhaustion),
	playerRoundScores: many(playerRoundScores),
	raceResults: many(raceResults),
	counterpicks: many(counterpicks),
	constructorExhaustions: many(constructorExhaustion),
}));

export const seasonsRelations = relations(seasons, ({many}) => ({
	grandsPrixes: many(grandsPrix),
	drivers: many(drivers),
	constructors: many(constructors),
	leagues: many(leagues),
	scoringRules: many(scoringRules),
	counterpickUsages: many(counterpickUsage),
	drafts: many(drafts),
	playerRoundScores: many(playerRoundScores),
}));

export const driversRelations = relations(drivers, ({one, many}) => ({
	constructor: one(constructors, {
		fields: [drivers.constructorId],
		references: [constructors.id]
	}),
	season: one(seasons, {
		fields: [drivers.seasonId],
		references: [seasons.id]
	}),
	drafts_driver1Id: many(drafts, {
		relationName: "drafts_driver1Id_drivers_id"
	}),
	drafts_driver2Id: many(drafts, {
		relationName: "drafts_driver2Id_drivers_id"
	}),
	drafts_driver3Id: many(drafts, {
		relationName: "drafts_driver3Id_drivers_id"
	}),
	drafts_wildcardId: many(drafts, {
		relationName: "drafts_wildcardId_drivers_id"
	}),
	driverExhaustions: many(driverExhaustion),
	raceResults: many(raceResults),
	counterpicks: many(counterpicks),
}));

export const constructorsRelations = relations(constructors, ({one, many}) => ({
	drivers: many(drivers),
	drafts: many(drafts),
	season: one(seasons, {
		fields: [constructors.seasonId],
		references: [seasons.id]
	}),
	constructorExhaustions: many(constructorExhaustion),
}));

export const draftsRelations = relations(drafts, ({one}) => ({
	constructor: one(constructors, {
		fields: [drafts.constructorId],
		references: [constructors.id]
	}),
	driver_driver1Id: one(drivers, {
		fields: [drafts.driver1Id],
		references: [drivers.id],
		relationName: "drafts_driver1Id_drivers_id"
	}),
	driver_driver2Id: one(drivers, {
		fields: [drafts.driver2Id],
		references: [drivers.id],
		relationName: "drafts_driver2Id_drivers_id"
	}),
	driver_driver3Id: one(drivers, {
		fields: [drafts.driver3Id],
		references: [drivers.id],
		relationName: "drafts_driver3Id_drivers_id"
	}),
	grandsPrix: one(grandsPrix, {
		fields: [drafts.grandPrixId],
		references: [grandsPrix.id]
	}),
	league: one(leagues, {
		fields: [drafts.leagueId],
		references: [leagues.id]
	}),
	player: one(players, {
		fields: [drafts.playerId],
		references: [players.id]
	}),
	driver_wildcardId: one(drivers, {
		fields: [drafts.wildcardId],
		references: [drivers.id],
		relationName: "drafts_wildcardId_drivers_id"
	}),
	season: one(seasons, {
		fields: [drafts.seasonId],
		references: [seasons.id]
	}),
}));

export const leaguesRelations = relations(leagues, ({one, many}) => ({
	drafts: many(drafts),
	driverExhaustions: many(driverExhaustion),
	playerRoundScores: many(playerRoundScores),
	season: one(seasons, {
		fields: [leagues.seasonId],
		references: [seasons.id]
	}),
	player: one(players, {
		fields: [leagues.createdByPlayerId],
		references: [players.id]
	}),
	counterpicks: many(counterpicks),
	constructorExhaustions: many(constructorExhaustion),
	counterpickUsages: many(counterpickUsage),
	playerLeagues: many(playerLeagues),
}));

export const playersRelations = relations(players, ({many}) => ({
	drafts: many(drafts),
	driverExhaustions: many(driverExhaustion),
	playerRoundScores: many(playerRoundScores),
	leagues: many(leagues),
	counterpicks_pickingPlayerId: many(counterpicks, {
		relationName: "counterpicks_pickingPlayerId_players_id"
	}),
	counterpicks_targetPlayerId: many(counterpicks, {
		relationName: "counterpicks_targetPlayerId_players_id"
	}),
	constructorExhaustions: many(constructorExhaustion),
	counterpickUsages: many(counterpickUsage),
	playerLeagues: many(playerLeagues),
}));

export const driverExhaustionRelations = relations(driverExhaustion, ({one}) => ({
	driver: one(drivers, {
		fields: [driverExhaustion.driverId],
		references: [drivers.id]
	}),
	grandsPrix: one(grandsPrix, {
		fields: [driverExhaustion.lastGrandPrixId],
		references: [grandsPrix.id]
	}),
	league: one(leagues, {
		fields: [driverExhaustion.leagueId],
		references: [leagues.id]
	}),
	player: one(players, {
		fields: [driverExhaustion.playerId],
		references: [players.id]
	}),
}));

export const playerRoundScoresRelations = relations(playerRoundScores, ({one}) => ({
	grandsPrix: one(grandsPrix, {
		fields: [playerRoundScores.grandPrixId],
		references: [grandsPrix.id]
	}),
	league: one(leagues, {
		fields: [playerRoundScores.leagueId],
		references: [leagues.id]
	}),
	player: one(players, {
		fields: [playerRoundScores.playerId],
		references: [players.id]
	}),
	season: one(seasons, {
		fields: [playerRoundScores.seasonId],
		references: [seasons.id]
	}),
}));

export const raceResultsRelations = relations(raceResults, ({one}) => ({
	driver: one(drivers, {
		fields: [raceResults.driverId],
		references: [drivers.id]
	}),
	grandsPrix: one(grandsPrix, {
		fields: [raceResults.grandPrixId],
		references: [grandsPrix.id]
	}),
}));

export const counterpicksRelations = relations(counterpicks, ({one}) => ({
	grandsPrix: one(grandsPrix, {
		fields: [counterpicks.grandPrixId],
		references: [grandsPrix.id]
	}),
	league: one(leagues, {
		fields: [counterpicks.leagueId],
		references: [leagues.id]
	}),
	player_pickingPlayerId: one(players, {
		fields: [counterpicks.pickingPlayerId],
		references: [players.id],
		relationName: "counterpicks_pickingPlayerId_players_id"
	}),
	driver: one(drivers, {
		fields: [counterpicks.targetDriverId],
		references: [drivers.id]
	}),
	player_targetPlayerId: one(players, {
		fields: [counterpicks.targetPlayerId],
		references: [players.id],
		relationName: "counterpicks_targetPlayerId_players_id"
	}),
}));

export const scoringRulesRelations = relations(scoringRules, ({one}) => ({
	season: one(seasons, {
		fields: [scoringRules.seasonId],
		references: [seasons.id]
	}),
}));

export const constructorExhaustionRelations = relations(constructorExhaustion, ({one}) => ({
	constructor: one(constructors, {
		fields: [constructorExhaustion.constructorId],
		references: [constructors.id]
	}),
	grandsPrix: one(grandsPrix, {
		fields: [constructorExhaustion.lastGrandPrixId],
		references: [grandsPrix.id]
	}),
	league: one(leagues, {
		fields: [constructorExhaustion.leagueId],
		references: [leagues.id]
	}),
	player: one(players, {
		fields: [constructorExhaustion.playerId],
		references: [players.id]
	}),
}));

export const counterpickUsageRelations = relations(counterpickUsage, ({one}) => ({
	league: one(leagues, {
		fields: [counterpickUsage.leagueId],
		references: [leagues.id]
	}),
	player: one(players, {
		fields: [counterpickUsage.playerId],
		references: [players.id]
	}),
	season: one(seasons, {
		fields: [counterpickUsage.seasonId],
		references: [seasons.id]
	}),
}));

export const playerLeaguesRelations = relations(playerLeagues, ({one}) => ({
	league: one(leagues, {
		fields: [playerLeagues.leagueId],
		references: [leagues.id]
	}),
	player: one(players, {
		fields: [playerLeagues.playerId],
		references: [players.id]
	}),
	season: one(seasons, {
		fields: [playerLeagues.seasonId],
		references: [seasons.id]
	}),
}));