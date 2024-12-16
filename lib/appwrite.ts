import { Account, Client, ID } from 'appwrite';

// Client Config
export const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)

export const account = new Account(client);

// Auth Functions
export async function createUserAccount(email: string, password: string, name: string) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        if (!newAccount) throw Error;

        // Return the user information directly
        return {
            userId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function signInAccount(email: string, password: string) {
    try {
        // Step 1: Create a session for the user
        const session = await account.createEmailPasswordSession(email, password);

        // Step 2: Fetch user details from the account service
        const userDetails = await account.get();

        // Return user information directly from the session and user details
        return {
            userId: session.$id,
            email: userDetails.email,
            name: userDetails.name || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function sendMagicLink(email: string, redirectUrl: string, name?: string, expire?: boolean) {
    try {
        // Send a magic link to the user's email
        const response = await account.createMagicURLToken(email, redirectUrl, name, expire);
        console.log(`Magic link sent to ${email}:`, response);
    } catch (error) {
        console.error('Error sending magic link:', error);
        throw error;
    }
}

export async function sendEmailOTP(email: string) {
    try {
        // Send an OTP to the user's email
        const response = await account.createVerification(email);
        console.log(`OTP sent to ${email}:`, response);
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        // If the account exists, return user details
        return {
            userId: currentAccount.$id,
            email: currentAccount.email,
            name: currentAccount.name || 'Guest',
            createdAt: new Date(currentAccount.$createdAt),
            updatedAt: new Date(currentAccount.$updatedAt),
        };
    } catch (error) {
        if (error instanceof Error && error.message.includes("missing scope")) {
            console.warn("Unauthenticated user detected.");
            return null; // Gracefully return null for unauthenticated users
        }
        console.error("Unexpected error:", error);
        throw error; // For any other unexpected errors, rethrow
    }
}

export async function signOutAccount() {
    try {
        return await account.deleteSession('current');
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteAccount(userId: string): Promise<void> {
    try {
        await account.deleteIdentity(userId);
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
}
