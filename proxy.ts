// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    // Your middleware logic here
    return NextResponse.next()
}

export const config = {
    matcher: '/api/:path*',
}