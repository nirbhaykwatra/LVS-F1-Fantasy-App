import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	constructorExhaustion: {
		constructor: r.one.constructors({
			from: r.constructorExhaustion.constructorId,
			to: r.constructors.id
		}),
		grandsPrix: r.one.grandsPrix({
			from: r.constructorExhaustion.lastGrandPrixId,
			to: r.grandsPrix.id
		}),
		league: r.one.leagues({
			from: r.constructorExhaustion.leagueId,
			to: r.leagues.id
		}),
		player: r.one.players({
			from: r.constructorExhaustion.playerId,
			to: r.players.id
		}),
	},
	constructors: {
		constructorExhaustions: r.many.constructorExhaustion(),
		season: r.one.seasons({
			from: r.constructors.seasonId,
			to: r.seasons.id,
			alias: "constructors_seasonId_seasons_id"
		}),
		drafts: r.many.drafts(),
		seasons: r.many.seasons({
			from: r.constructors.id.through(r.drivers.constructorId),
			to: r.seasons.id.through(r.drivers.seasonId),
			alias: "constructors_id_seasons_id_via_drivers"
		}),
	},
	grandsPrix: {
		constructorExhaustions: r.many.constructorExhaustion(),
		counterpicks: r.many.counterpicks(),
		drafts: r.many.drafts(),
		driverExhaustions: r.many.driverExhaustion(),
		season: r.one.seasons({
			from: r.grandsPrix.seasonId,
			to: r.seasons.id
		}),
		playerRoundScores: r.many.playerRoundScores(),
		drivers: r.many.drivers(),
	},
	leagues: {
		constructorExhaustions: r.many.constructorExhaustion(),
		counterpickUsages: r.many.counterpickUsage(),
		counterpicks: r.many.counterpicks(),
		drafts: r.many.drafts(),
		driverExhaustions: r.many.driverExhaustion(),
		season: r.one.seasons({
			from: r.leagues.seasonId,
			to: r.seasons.id
		}),
		createdByPlayer: r.one.players({
			from: r.leagues.createdByPlayerId,
			to: r.players.id
		}),
		players: r.many.players({
			from: r.leagues.id.through(r.playerLeagues.leagueId),
			to: r.players.id.through(r.playerLeagues.playerId)
		}),
		playerRoundScores: r.many.playerRoundScores(),
	},
	players: {
		constructorExhaustions: r.many.constructorExhaustion(),
		counterpickUsages: r.many.counterpickUsage(),
		counterpicksPickingPlayerId: r.many.counterpicks({
			alias: "counterpicks_pickingPlayerId_players_id"
		}),
		counterpicksTargetPlayerId: r.many.counterpicks({
			alias: "counterpicks_targetPlayerId_players_id"
		}),
		drafts: r.many.drafts(),
		driverExhaustions: r.many.driverExhaustion(),
		leagues: r.many.leagues(),
		playerRoundScores: r.many.playerRoundScores(),
	},
	seasons: {
		constructorsSeasonId: r.many.constructors({
			alias: "constructors_seasonId_seasons_id"
		}),
		counterpickUsages: r.many.counterpickUsage(),
		constructorsViaDrivers: r.many.constructors({
			alias: "constructors_id_seasons_id_via_drivers"
		}),
		grandsPrixes: r.many.grandsPrix(),
		leagues: r.many.leagues(),
		scoringRules: r.many.scoringRules(),
	},
	counterpickUsage: {
		league: r.one.leagues({
			from: r.counterpickUsage.leagueId,
			to: r.leagues.id
		}),
		player: r.one.players({
			from: r.counterpickUsage.playerId,
			to: r.players.id
		}),
		season: r.one.seasons({
			from: r.counterpickUsage.seasonId,
			to: r.seasons.id
		}),
	},
	counterpicks: {
		grandsPrix: r.one.grandsPrix({
			from: r.counterpicks.grandPrixId,
			to: r.grandsPrix.id
		}),
		league: r.one.leagues({
			from: r.counterpicks.leagueId,
			to: r.leagues.id
		}),
		playerPickingPlayerId: r.one.players({
			from: r.counterpicks.pickingPlayerId,
			to: r.players.id,
			alias: "counterpicks_pickingPlayerId_players_id"
		}),
		driver: r.one.drivers({
			from: r.counterpicks.targetDriverId,
			to: r.drivers.id
		}),
		playerTargetPlayerId: r.one.players({
			from: r.counterpicks.targetPlayerId,
			to: r.players.id,
			alias: "counterpicks_targetPlayerId_players_id"
		}),
	},
	drivers: {
		counterpicks: r.many.counterpicks(),
		draftsDriver1Id: r.many.drafts({
			alias: "drafts_driver1Id_drivers_id"
		}),
		draftsDriver2Id: r.many.drafts({
			alias: "drafts_driver2Id_drivers_id"
		}),
		draftsDriver3Id: r.many.drafts({
			alias: "drafts_driver3Id_drivers_id"
		}),
		draftsWildcardId: r.many.drafts({
			alias: "drafts_wildcardId_drivers_id"
		}),
		driverExhaustions: r.many.driverExhaustion(),
		grandsPrixes: r.many.grandsPrix({
			from: r.drivers.id.through(r.raceResults.driverId),
			to: r.grandsPrix.id.through(r.raceResults.grandPrixId)
		}),
	},
	drafts: {
		constructor: r.one.constructors({
			from: r.drafts.constructorId,
			to: r.constructors.id
		}),
		driverDriver1Id: r.one.drivers({
			from: r.drafts.driver1Id,
			to: r.drivers.id,
			alias: "drafts_driver1Id_drivers_id"
		}),
		driverDriver2Id: r.one.drivers({
			from: r.drafts.driver2Id,
			to: r.drivers.id,
			alias: "drafts_driver2Id_drivers_id"
		}),
		driverDriver3Id: r.one.drivers({
			from: r.drafts.driver3Id,
			to: r.drivers.id,
			alias: "drafts_driver3Id_drivers_id"
		}),
		grandsPrix: r.one.grandsPrix({
			from: r.drafts.grandPrixId,
			to: r.grandsPrix.id
		}),
		league: r.one.leagues({
			from: r.drafts.leagueId,
			to: r.leagues.id
		}),
		player: r.one.players({
			from: r.drafts.playerId,
			to: r.players.id
		}),
		driverWildcardId: r.one.drivers({
			from: r.drafts.wildcardId,
			to: r.drivers.id,
			alias: "drafts_wildcardId_drivers_id"
		}),
	},
	driverExhaustion: {
		driver: r.one.drivers({
			from: r.driverExhaustion.driverId,
			to: r.drivers.id
		}),
		grandsPrix: r.one.grandsPrix({
			from: r.driverExhaustion.lastGrandPrixId,
			to: r.grandsPrix.id
		}),
		league: r.one.leagues({
			from: r.driverExhaustion.leagueId,
			to: r.leagues.id
		}),
		player: r.one.players({
			from: r.driverExhaustion.playerId,
			to: r.players.id
		}),
	},
	playerRoundScores: {
		grandsPrix: r.one.grandsPrix({
			from: r.playerRoundScores.grandPrixId,
			to: r.grandsPrix.id
		}),
		league: r.one.leagues({
			from: r.playerRoundScores.leagueId,
			to: r.leagues.id
		}),
		player: r.one.players({
			from: r.playerRoundScores.playerId,
			to: r.players.id
		}),
	},
	scoringRules: {
		season: r.one.seasons({
			from: r.scoringRules.seasonId,
			to: r.seasons.id
		}),
	},
}))