'use client'

import { signOut } from "@/app/actions/auth";

export default function SignOutButton() {
    return (
        <form onSubmit={async (e) => {
            e.preventDefault()
            await signOut()
        }}>
            <button className="rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/20" type="submit">Sign Out</button>
        </form>
    )
}