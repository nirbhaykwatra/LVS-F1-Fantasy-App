import {Suspense} from "react";

export default async function CompleteSignupLayout({ children, }: { children: React.ReactNode }) {
    return (
        <div>
            <Suspense fallback={<div></div>}>
                {children}
            </Suspense>
        </div>
    )
}