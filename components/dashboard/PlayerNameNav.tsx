import { getCurrentUser } from "@/lib/dal/user";

export async function PlayerNameNav() {
    const user = await getCurrentUser();
    if (!user) return null;

    return (
        <div>
            {user?.username}
        </div>
    );
};
