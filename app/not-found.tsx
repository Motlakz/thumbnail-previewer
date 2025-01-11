"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const NotFoundPage = () => {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-pink-50 via-cyan-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black">
            <motion.article
                className="text-center p-6 rounded-xl shadow-md bg-white/70 dark:bg-black/50 backdrop-blur-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.h1
                    className="sm:text-7xl text-5xl font-bold text-primary dark:text-pink-400 mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    404
                </motion.h1>
                <motion.h2
                    className="sm:text-2xl text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300"
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    Oops! Page Not Found
                </motion.h2>
                <motion.p
                    className="text-muted-foreground mb-8 max-w-md mx-auto text-gray-500 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    Looks like this page took a creative break! But don&apos;t worry, we&apos;ll have you back on track in no time.
                </motion.p>

                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 bg-cyan-500 text-white hover:bg-pink-500 transition-all px-4 py-2 rounded-md text-sm font-medium shadow-lg dark:bg-pink-500 dark:hover:bg-pink-400"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home Page
                </Link>
            </motion.article>
        </section>
    );
};

export default NotFoundPage;
