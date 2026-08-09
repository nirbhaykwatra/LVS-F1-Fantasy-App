// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    // Check if user is authenticated (e.g., via a cookie)
    const isAuthenticated = request.cookies.has('auth_token')

    // If trying to access a protected route and not authenticated
    if (request.nextUrl.pathname.startsWith('/dashboard') && !isAuthenticated) {
        // Redirect to login page
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/signin') && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}