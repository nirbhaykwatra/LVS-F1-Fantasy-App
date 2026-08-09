import getDate from "@/components/common/Date";

export default async function AuthLayout({ children, }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <footer className="relative z-10 mt-auto flex items-center justify-center px-6 py-6 text-xs text-foreground/50">
                © {await getDate()} Nirbhay Kwatra. This application is not affiliated with the FIA, FOM, the Formula One brand or Liberty Media in any way.
            </footer>
        </>
    )
}