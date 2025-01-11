"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { getCurrentUser, signOutAccount } from "@/lib/appwrite";
import { User } from "@/types/user";
import Image from "next/image";
import Logo from "../public/cutesy_thumbnail_logo.png"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const gradientButtonClass = `
        relative border-2 border-transparent bg-clip-border
        before:absolute before:inset-0 before:-z-10 before:rounded-md
        before:bg-gradient-to-br before:from-pink-500 before:to-cyan-500
        before:content-['']
        after:absolute after:inset-[2px] after:-z-10 after:rounded-[4px]
        after:bg-white after:content-[''] dark:after:bg-gray-950
        transition-all duration-300
        bg-gradient-to-br from-pink-500 to-cyan-500
        text-transparent bg-clip-text
        hover:text-gray-900 dark:hover:text-gray-100
    `;

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Navigation items based on authentication status
    const navItems = user
        ? [
              { name: "Dashboard", href: "/dashboard" },
              { name: "Upgrade", href: "/dashboard/pricing" },
              { name: "Editor", href: "/dashboard/editor" },
              { name: "Profile", href: "/dashboard/profile"}
          ]
        : [
              { name: "Home", href: "/" },
              { name: "Features", href: "/#features" },
              { name: "Pricing", href: "/#pricing" },
              { name: "FAQ", href: "/#faq" },
          ];

    return (
        <nav
            className={`fixed top-0 z-20 w-full transition-all duration-300 ${
                isScrolled
                    ? "bg-white/80 backdrop-blur-md dark:bg-gray-950/80 shadow-lg"
                    : "bg-transparent"
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-4">
                        <Image
                            src={Logo}
                            width={48}
                            height={48} 
                            alt="thumbnail previewer cutesy logo"
                            className="rounded-lg"
                        />
                        <figcaption><sub className="text-xl text-pink-700 dark:text-pink-400">Thumbnail</sub><sup className="text-lg text-cyan-600 dark:text-cyan-400">Previewer</sup></figcaption>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-medium text-gray-700 hover:text-pink-600 dark:text-gray-200 dark:hover:text-pink-400 transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <ModeToggle />
                            {user ? (
                                <Button
                                    className={gradientButtonClass}
                                    onClick={async () => {
                                        await signOutAccount();
                                        setUser(null);
                                    }}
                                >
                                    Sign out
                                </Button>
                            ) : (
                                <Button
                                    className={gradientButtonClass}
                                    asChild
                                >
                                    <Link href="/login">Sign in</Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden flex items-center space-x-4">
                        <ModeToggle />
                        <Button
                            variant="ghost"
                            onClick={() => setIsOpen(!isOpen)}
                            className="border text-slate-700 dark:text-gray-200"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-gray-950 border-t dark:border-gray-800"
                    >
                        <div className="px-4 py-2 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 dark:text-gray-200 dark:hover:text-pink-400"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {user ? (
                                <Button
                                    className={`w-full ${gradientButtonClass}`}
                                    onClick={async () => {
                                        await signOutAccount();
                                        setUser(null);
                                    }}
                                >
                                    Sign out
                                </Button>
                            ) : (
                                <Button
                                    className={`w-full ${gradientButtonClass}`}
                                    asChild
                                >
                                    <Link href="/login">Sign in</Link>
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
