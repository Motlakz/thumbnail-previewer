"use client"

import { motion } from 'framer-motion';
import { Pencil, Layout, Eye, Upload } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

// Light mode images
import LightStep1 from '../../public/demo/light/lightstep1.png';
import LightStep2 from '../../public/demo/light/lightstep2.png';
import LightStep3 from '../../public/demo/light/lightstep3.png';
import LightStep4 from '../../public/demo/light/lightstep4.png';

// Dark mode images
import DarkStep1 from '../../public/demo/dark/step1.png';
import DarkStep2 from '../../public/demo/dark/step2.png';
import DarkStep3 from '../../public/demo/dark/step3.png';
import DarkStep4 from '../../public/demo/dark/step4.png';
import { useEffect, useState } from 'react';

const StepsArray = [
    { 
        icon: Upload, 
        step: "Step 1", 
        description: "Upload your thumbnail based on chosen social", 
        images: {
            light: LightStep1,
            dark: DarkStep1
        },
        index: 0 
    },
    { 
        icon: Eye, 
        step: "Step 2", 
        description: "Preview on different devices", 
        images: {
            light: LightStep2,
            dark: DarkStep2
        },
        index: 1 
    },
    { 
        icon: Layout, 
        step: "Step 3", 
        description: "Edit the dummy content to suit your preferences", 
        images: {
            light: LightStep3,
            dark: DarkStep3
        },
        index: 2 
    },
    { 
        icon: Pencil, 
        step: "Step 4", 
        description: "(Optionally) Edit your thumbnail", 
        images: {
            light: LightStep4,
            dark: DarkStep4
        },
        index: 3 
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
        opacity: 1, 
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10
        }
    }
};

const iconAnimation = {
    rest: { scale: 1, rotate: 0 },
    hover: { 
        scale: 1.2,
        rotate: 360,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 10
        }
    }
};

const imageAnimation = {
    rest: { scale: 1 },
    hover: { 
        scale: 1.05,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20
        }
    }
};

export default function Steps() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // After mounting, we have access to the theme
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <motion.div 
            className="mb-4 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
        >

            {/* Decorative lines with animations */}
            <motion.div 
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
            />

            <article className="mb-8 mt-12">
                <h1 className="text-3xl pt-16 font-bold text-center mb-2">Thumbnail Tester</h1>
                <p className="text-center text-gray-600 dark:text-gray-400">
                    Preview your thumbnails across different social platforms and devices
                </p>
            </article>
                
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 py-4"
            >
                {StepsArray.map((step, index) => (
                    <motion.div
                        key={index}
                        variants={item}
                        whileHover={{ 
                            y: -5,
                            transition: { 
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }
                        }}
                        className="group relative p-6 bg-white/70 hover:bg-white dark:bg-background/40 dark:hover:bg-background/60 backdrop-blur-lg rounded-2xl border border-primary/10 shadow-lg hover:shadow-primary/20 transition-all duration-300"
                    >
                        <motion.div 
                            className="mb-6 flex items-center gap-4"
                            initial="rest"
                            whileHover="hover"
                        >
                            <motion.div 
                                className="p-3 bg-primary/10 rounded-xl"
                                variants={iconAnimation}
                            >
                                <step.icon className="h-6 w-6 text-primary" />
                            </motion.div>
                            <motion.h2 
                                className="text-xl font-medium text-primary tracking-wider"
                                whileHover={{ scale: 1.05, x: 5 }}
                            >
                                {step.step}
                            </motion.h2>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="text-sm text-muted-foreground mb-6"
                        >
                            {step.description}
                        </motion.p>

                        <motion.div 
                            className="relative bg-pink-400/20 dark:bg-cyan-400/50 h-64 w-full overflow-hidden rounded-xl border border-primary/10"
                            initial="rest"
                            whileHover="hover"
                            variants={imageAnimation}
                        >
                            <Image 
                                src={theme === 'dark' ? step.images.dark : step.images.light}
                                alt={`${step.step} screenshot`}
                                className="w-full h-full object-cover sm:object-contain"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                priority={index === 0}
                            />
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                            />
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}
