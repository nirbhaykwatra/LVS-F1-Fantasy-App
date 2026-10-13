import Link from "next/link";

export async function HeaderLogoButton(){
    return (
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold tracking-widest text-foreground">
        <span className="h-2.5 w-2.5 rounded-full bg-brand" />
        LVS F1 FANTASY
        </Link>
    );
}