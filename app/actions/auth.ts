'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { z } from 'zod';
import {
    verifyPassword,
    createUser,
    createSession,
    deleteSession,
    linkPlayerCredentials
} from "@/lib/auth";
import { getCurrentUser, getUserByEmail} from "@/lib/dal";

// Define Zod schema for signin validation
const SignInSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
})

// Define Zod schema for signup validation
const SignUpSchema = z
    .object({
        username: z.string().min(1, 'Username is required').nonempty(),
        email: z.string().min(1, 'Email is required').email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

export type SignInData = z.infer<typeof SignInSchema>
export type SignUpData = z.infer<typeof SignUpSchema>

export type ActionResponse = {
    success: boolean
    message: string
    errors?: Record<string, string[]>
    error?: string
}

export const signIn= async (prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> => {
    try {

        // Get form data from request
        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        }

        // Validate form data with Zod schema
        const validation = SignInSchema.safeParse(data);
        if (!validation.success) {
            return {
                success: false,
                message: 'Validation failed',
                errors: validation.error.flatten().fieldErrors,
            };
        }

        // Get user by email from data access layer
        const user = await getUserByEmail(data.email);
        if (!user) {
            return {
                success: false,
                message: 'Invalid email or password',
                errors: {
                    email: ['Invalid email or password'],
                },
            };
        }

        // If user exists but has no password, it means they have not yet completed the Discord migration
        // TODO: Remove this guard after all Discord users have completed the migration
        if (!user.password) {
            return {
                success: false,
                message: 'Discord migration not complete!',
                errors: {
                    migration: ['Discord migration not complete!'],
                },
            };
        }

        // Verify password
        const isValidPassword = await verifyPassword(data.password, user.password);
        if (!isValidPassword) {
            return {
                success: false,
                message: 'Invalid email or password',
                errors: {
                    password: ['Invalid email or password'],
                },
            };
        }

        // If all previous checks pass, create session
        await createSession(user.id);

        return {
            success: true,
            message: 'Sign in successful',
        };

    } catch(error) {
        console.error(error)
        return {
          success: false,
          message: 'Sign in failed',
          errors: {},
          error: 'Sign in failed',
        };
    }
}

export const signUp = async (prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> => {
    try {

        // Get form data from request
        const data = {
            username: formData.get('username') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword'),
        }

        // Validate form data
        const validationResult = SignUpSchema.safeParse(data)
        if (!validationResult.success) {
            return {
                success: false,
                message: 'Validation failed',
                errors: validationResult.error.flatten().fieldErrors,
            }
        }

        // Check if user already exists. If so, return an error
        const existingUser = await getUserByEmail(data.email)
        if (existingUser) {
            return {
                success: false,
                message: 'Something went wrong',
                error: 'Something went wrong',
            }
        }

        // Create a new user
        const user = await createUser(data.username, data.email, data.password)
        if (!user) {
            return {
                success: false,
                message: 'Try again',
                error: 'Account could not be created',
            }
        }

        // Create a new session
        await createSession(user.id)

        return {
            success: true,
            message: 'Account created',
        }
    } catch (error) {
        console.error(error)
        return {
          success: false,
          message: 'Signing up failed',
          error: 'Signing up failed',
        };
    }
}

export const signOut = async () => {
    try {
        await deleteSession();
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        redirect('/')
    }
}

export const completeDiscordSignup = async (prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> => {
    try {
        const cookieStore = await cookies()
        const pendingId = cookieStore.get('discord_pending_id')?.value

        if (!pendingId) {
            return {
                success: false,
                message: 'Session expired',
                error: 'No pending Discord sign-up found. Please try again.',
            }
        }

        const playerId = parseInt(pendingId, 10)
        if (isNaN(playerId)) {
            return {
                success: false,
                message: 'Invalid session',
                error: 'Invalid pending sign-up data.',
            }
        }

        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        }

        const validationResult = SignUpSchema.safeParse(data)
        if (!validationResult.success) {
            return {
                success: false,
                message: 'Validation failed',
                errors: validationResult.error.flatten().fieldErrors,
            }
        }

        const existingUser = await getUserByEmail(data.email)
        if (existingUser) {
            return {
                success: false,
                message: 'Something went wrong',
                error: 'Something went wrong',
            }
        }

        const updated = await linkPlayerCredentials(playerId, data.email, data.password)
        if (!updated) {
            return {
                success: false,
                message: 'Try again',
                error: 'Could not link account credentials.',
            }
        }

        cookieStore.delete('discord_pending_id')
        await createSession(playerId)

        return {
            success: true,
            message: 'Account linked',
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: 'Sign up failed',
            error: 'Sign up failed',
        }
    }
}

