"use client";

import { ModeToggle } from "@/components/dashboard/ModeToggle";
import { gradientButtonClass } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { account } from "@/lib/appwrite";
import { Edit2, LogOut, Settings2, Star, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await account.deleteSession('current');
            router.push('/login');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };
    
    return (
        <div className="flex h-screen">
            <main className="flex flex-col flex-1">
                <header className="flex items-center justify-between px-6 py-4 h-[50px]">
                    <div className="gap-1 flex items-center">
                        <Button variant="outline" className="border group hover:bg-cyan-500 dark:hover:text-cyan-500 dark:hover:border-cyan-500 dark:hover:bg-transparent hover:text-white" asChild>
                            <Link href="/dashboard/">
                                Dashboard
                            </Link>
                        </Button>
                        <Button variant="outline" className="border group hover:bg-violet-500 hover:text-white dark:hover:text-violet-400 dark:hover:bg-transparent dark:hover:border-violet-400" asChild>
                            <Link href="/dashboard/pricing">
                                Upgrade <Star className="ml-2 w-4 h-4 text-yellow-500 group-hover:fill-yellow-200" />
                            </Link>
                        </Button>
                        <Button variant="outline" className="border group hover:bg-violet-500 hover:text-white dark:hover:text-violet-400 dark:hover:bg-transparent dark:hover:border-violet-400" asChild>
                            <Link href="/dashboard/pricing">
                                Editor <Edit2 className="ml-2 w-4 h-4 text-green-500 group-hover:fill-green-200" />
                            </Link>
                        </Button>
                        <Button variant="outline" className="border group hover:bg-violet-500 hover:text-white dark:hover:text-violet-400 dark:hover:bg-transparent dark:hover:border-violet-400" asChild>
                            <Link href="/dashboard/pricing">
                                Settings <Settings2 className="ml-2 w-4 h-4 text-gray-500 group-hover:fill-gray-200" />
                            </Link>
                        </Button>
                        <ModeToggle />
                        <div className="flex items-center gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut} className={`w-full ${gradientButtonClass}`}>
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>
                <Separator />
                <div className="flex-1 overflow-auto">
                    <section className="sm:p-8 p-4 text-accent-foreground">
                        {children}
                    </section>
                </div>
            </main>
        </div>
    )
};

export default DashboardLayout;
