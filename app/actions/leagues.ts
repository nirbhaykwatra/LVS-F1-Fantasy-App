import {ActionResponse} from "@/app/actions/auth";

export async function createLeague(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse | null> {


    return {
        success: false,
        message: "Could not create league!"
    }
}