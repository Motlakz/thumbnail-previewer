"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Coffee } from "lucide-react";
import Image from "next/image";
import Logo from "/cutesy_thumbnail_logo.png";
import { ModeToggle } from "./ModeToggle";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const coffeeButtonClass = `
        group relative px-6 py-2 rounded-full
        bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500
        hover:from-pink-600 hover:via-yellow-600 hover:to-cyan-600
        text-white font-medium shadow-lg
        transform transition-all duration-300
        hover:scale-105 hover:shadow-xl
        flex items-center gap-2
    `;

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
                        <figcaption>
                            <sub className="text-xl text-pink-700 dark:text-pink-400">Thumbnail</sub>
                            <sup className="text-lg text-cyan-600 dark:text-cyan-400">Previewer</sup>
                        </figcaption>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-8">
                            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-pink-600 dark:text-gray-200 dark:hover:text-pink-400 transition-colors">
                                Home
                            </Link>
                            <ModeToggle />
                            <Link
                                href="https://www.buymeacoffee.com/motlalepulasello"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={coffeeButtonClass}
                            >
                                <Coffee className="w-5 h-5 group-hover:animate-bounce" />
                                <span>Buy me a coffee</span>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-gray-700 dark:text-gray-200"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
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
                        <div className="px-4 py-2 space-y-4">
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 dark:text-gray-200 dark:hover:text-pink-400"
                            >
                                Home
                            </Link>
                            <a
                                href="https://www.buymeacoffee.com/motlalepulasello"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${coffeeButtonClass} justify-center`}
                                onClick={() => setIsOpen(false)}
                            >
                                <Coffee className="w-5 h-5 group-hover:animate-bounce" />
                                <span>Buy me a coffee</span>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default Navbar;
