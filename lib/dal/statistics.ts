import {and, eq, sql} from "drizzle-orm";
import {constructors, drafts} from "@/db/schema";
import {db} from "@/db";
import {MostDraftedConstructor} from "@/lib/dal/playerInfo";

export async function getMostDraftedConstructorForPlayer(
    playerId: number, options?: { leagueId?: number; seasonId?: number }): Promise<MostDraftedConstructor | null> {

    const conditions = [eq(drafts.playerId, playerId)];

    if (options?.leagueId !== undefined) {
        conditions.push(eq(drafts.leagueId, options.leagueId));
    }
    if (options?.seasonId !== undefined) {
        conditions.push(eq(drafts.seasonId, options.seasonId));
    }

    const [result] = await db
        .select({
            constructorId: constructors.id,
            shortName: constructors.shortName,
            fullName: constructors.fullName,
            colorHex: constructors.colorHex,
            timesDrafted: sql<number>`count(*)`.mapWith(Number),
        })
        .from(drafts)
        .innerJoin(constructors, eq(drafts.constructorId, constructors.id))
        .where(and(...conditions))
        .groupBy(constructors.id, constructors.shortName, constructors.fullName, constructors.colorHex)
        .orderBy(sql`count(*) desc`)
        .limit(1);

    return result ?? null;
}