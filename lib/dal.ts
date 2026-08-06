import { db } from '@/db'
import { getSession } from './auth'
import { eq } from 'drizzle-orm'
import { players } from '@/db/schema'
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
    const session = await getSession()

    if (!session) {
        return null
    }

    try {
        const results = await db
            .select()
            .from(players)
            .where(eq(players.id, session.userId))

        return results[0] || null
    } catch (e) {
        console.error(e)
        return null
    }
})

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.query.players.findFirst({
            where: eq(players.email, email),
        })

        return user
    } catch (e) {
        console.error(e)
        return null
    }
}

export const getUserByDiscordID = async (discordId: number) => {
    try {
        const user = await db.query.players.findFirst({
            where: eq(players.discordUserId, discordId),
        })

        return user
    } catch(e) {
        console.error(e);
        return null;
    }
}

export const getUserByUsername = async (username: string) => {
    try {
        const user = await db.query.players.findFirst({
            where: eq(players.username, username),
        })

        return user
    } catch (e) {
        console.error(e)
        return null
    }
}
