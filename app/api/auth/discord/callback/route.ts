import { NextRequest, NextResponse } from 'next/server'
import { getUserByUsername } from '@/lib/dal/user'
import { createSession } from '@/lib/auth'
import { cookies } from 'next/headers'

async function exchangeCodeForToken(code: string): Promise<string> {
    const res = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID!,
            client_secret: process.env.DISCORD_CLIENT_SECRET!,
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.DISCORD_REDIRECT_URI!,
        }),
    })
    const data = await res.json()
    return data.access_token
}

async function getDiscordUser(accessToken: string) {
    const res = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` },
    })
    return await res.json() as Promise<{ id: string; username: string; email?: string }>
}

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code')
    if (!code) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin

    try {
        const accessToken = await exchangeCodeForToken(code)
        const discordUser = await getDiscordUser(accessToken)

        const existingPlayer = await getUserByUsername(discordUser.username)

        if (existingPlayer) {
            // Player exists — check if they have a password set
            if (!existingPlayer.password) {
                // Known Discord user but no web credentials yet:
                // Store their DB player ID in a short-lived cookie and redirect to complete sign-up
                const cookieStore = await cookies()
                cookieStore.set('discord_pending_id', String(existingPlayer.id), {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 15, // 15 minutes
                    path: '/',
                    sameSite: 'lax',
                })
                return NextResponse.redirect(new URL('/signup/complete', baseUrl))
            }

            // Player has full credentials — log them in directly
            await createSession(existingPlayer.id)
            return NextResponse.redirect(new URL('/dashboard', baseUrl))
        }

        return NextResponse.redirect(new URL('/signup', baseUrl))
    } catch (err) {
        console.error('Discord OAuth error:', err)
        return NextResponse.redirect(new URL('/signin', baseUrl))
    }
}