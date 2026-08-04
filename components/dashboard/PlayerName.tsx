import { getCurrentUser } from "@/lib/dal";

export default async function PlayerName() {
    const user = await getCurrentUser();
    return user?.username;
}