import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import CompleteSignupForm from "@/components/auth/CompleteSignupForm";

export default async function CompleteSignupPage() {
    const cookieStore = await cookies();
    const discordPendingId = cookieStore.get("discord_pending_id")?.value;

    if (!discordPendingId) redirect("/signup");
    return (
        <div className="relative isolate flex flex-1 flex-col bg-background font-sans">
            <AnimatedBackground />

            <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-mono text-sm font-bold tracking-widest text-foreground"
                >
                    <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                    LVS F1 FANTASY
                </Link>
            </header>

            <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-2 text-center">
                        <span className="mx-auto rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
                          Almost There
                        </span>
                        <h1 className="text-3xl font-black leading-tight text-foreground">
                            Complete Your Profile
                        </h1>
                        <p className="text-sm text-foreground/60">
                            Your Discord account was recognised. Set an email and password to finish linking your account.
                        </p>
                    </div>

                    <CompleteSignupForm />
                </div>
            </main>
        </div>
    );
}