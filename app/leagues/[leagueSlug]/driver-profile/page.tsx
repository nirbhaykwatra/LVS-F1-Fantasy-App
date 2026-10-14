import { Suspense } from "react";
import { getCurrentUser } from "@/lib/dal/user";
import Link from "next/link";

export default async function DriverProfilePage() {
    const user = await getCurrentUser();
    if (!user) return null;

    return (
        <main className="relative z-10 flex flex-1 flex-col gap-8 px-6 sm:px-10 max-w-5xl mx-auto w-full">
            {/* Welcome Section */}
            <div className="flex flex-col gap-2">
                <span className="">
                    <Link
                        href="/dashboard"
                        className="w-fit rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand"
                    >
                    ← Back to dashboard
                </Link>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Replace with Driver name */}
                    <h1 className="text-3xl font-black leading-tight text-foreground">
                        Driver Profile
                    </h1>
                    <div className="sm:justify-self-end">
                        <Suspense fallback={<div></div>}>
                            {/* Add drivers dropdown here*/}
                        </Suspense>
                    </div>
                </div>

                {/* Add the following sections:
                    1. Selected driver points graph (add options for cumulative, etc)
                    2. Stats (average finishing position, average points scored, etc)
                    3. Compare with another driver (with graphs)
                */}

            </div>
        </main>
    );
}