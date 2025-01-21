import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import { User } from '@/types/user';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await account.get();
                const userDetails = await account.get();

                const customUser: User = {
                    userId: session.$id,
                    email: userDetails.email,
                    name: userDetails.name || '',
                    createdAt: new Date(), 
                    updatedAt: new Date(), 
                };

                setUser(customUser);
            } catch (error) {
                console.error('Error fetching user session:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    return { user, loading };
}
