import  { redirect } from "next/navigation";
import { ActionResponse } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/dal/user";

export async function createLeague(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse | null> {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "You need to sign in first.", error: "You need to sign in first." };

    const name = String(formData.get("name") ?? "").trim();
    if (!name) return { success: false, message: "You need to sign in first.", error: "Give your league a name." };
    if (name.length > 40) return { success: false, message: "You need to sign in first.", error: "Keep the name under 40 characters." };

    const visibility = formData.get("visibility") === "public" ? "public" : "private";

    // const league = await createLeague({
    //     name,
    //     isPublic: visibility === "public",
    //     ownerId: user.id,
    // }).catch(() => null);
    //
    // if (!league) return { error: "Something went wrong creating your league. Try again." };
    //
    redirect(`/leagues/dashboard`);

    return {
        success: false,
        message: "Could not create league!"
    }
}

async function createLeagueAction(
    _prevState: CreateLeagueState,
    formData: FormData
): Promise<CreateLeagueState> {
    "use server";




}