"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/appwrite";
import { User } from "@/types/user";
import Link from "next/link";
import {
  History,
  Settings,
  Plus,
  Star,
  Lock,
  FileImage,
  Share2,
} from "lucide-react";
import { Button } from "./ui/button";

const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const shortcuts = [
        {
            icon: <Plus className="w-6 h-6" />,
            title: "New Preview",
            description: "Create a new thumbnail preview",
            href: "/editor",
            color: "text-green-500",
        },
        {
            icon: <History className="w-6 h-6" />,
            title: "Recent Previews",
            description: "View your recent thumbnails",
            href: "/history",
            color: "text-blue-500",
        },
        {
            icon: <Star className="w-6 h-6" />,
            title: "Saved Templates",
            description: "Access your saved templates",
            href: "/templates",
            color: "text-yellow-500",
        },
        {
            icon: <FileImage className="w-6 h-6" />,
            title: "My Files",
            description: "Manage your uploaded files",
            href: "/files",
            color: "text-purple-500",
        },
        {
            icon: <Share2 className="w-6 h-6" />,
            title: "Shared With Me",
            description: "View shared previews",
            href: "/shared",
            color: "text-orange-500",
        },
        {
            icon: <Settings className="w-6 h-6" />,
            title: "Settings",
            description: "Manage your preferences",
            href: "/settings",
            color: "text-gray-500",
        },
    ];

    if (isLoading) {
        return null;
    }

    return (
        <div className="min-h-screen sm:pt-32 pt-24 bg-gradient-to-br from-pink-50 via-pink-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black">
            <AnimatePresence mode="wait">
                {!user ? (
                    <motion.div
                        key="locked"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="container mx-auto px-4 py-16"
                    >
                        <div className="max-w-2xl mx-auto text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                            <Lock className="w-16 h-16 mx-auto mb-6 text-pink-500 dark:text-cyan-400" />
                            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-pink-600 dark:from-cyan-400 dark:to-cyan-500 bg-clip-text text-transparent">
                                Access Your Dashboard
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mb-8">
                                Sign in to access your thumbnail previews, history, and settings.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    className="bg-gradient-to-br from-pink-500 to-pink-600 dark:from-cyan-400 dark:to-cyan-500 text-white hover:opacity-90"
                                    asChild
                                >
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button
                                    className="bg-white dark:bg-gray-800 text-pink-500 dark:text-cyan-400 border-2 border-pink-500 dark:border-cyan-400 hover:bg-pink-50 dark:hover:bg-gray-700"
                                    asChild
                                >
                                    <Link href="/register">Create Account</Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div key="dashboard" className="container mx-auto px-4 py-8">
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8"
                        >
                            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-pink-600 dark:from-cyan-400 dark:to-cyan-500 bg-clip-text text-transparent">
                                Welcome back, {user.name}!
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                Access your thumbnail preview tools and recent activity.
                            </p>
                        </motion.article>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {shortcuts.map((shortcut, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link
                                        href={shortcut.href}
                                        className="block p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <div className={`${shortcut.color} mb-4`}>{shortcut.icon}</div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                                            {shortcut.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {shortcut.description}
                                        </p>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Dashboard;
