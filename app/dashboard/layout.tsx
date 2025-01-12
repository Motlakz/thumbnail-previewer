"use client"

import { useState, useEffect, ReactNode } from "react";
import { getCurrentUser } from "@/lib/appwrite";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsLoading(true);
                const currentUser = await getCurrentUser();
                
                if (!currentUser) {
                    // Redirect to login if no user is found
                    router.push('/login');
                    return;
                }
                
                setUser(currentUser);
            } catch (error) {
                console.error('Error fetching user:', error);
                // Handle error appropriately
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="animate-spin" />
            </div>
        );
    }

    // If no user and not loading, don't render children
    if (!user && !isLoading) {
        return null; // Or redirect will handle it
    }

    return (
        <main className="min-h-screen">
            {children}
        </main> 
    );
}

export default DashboardLayout;