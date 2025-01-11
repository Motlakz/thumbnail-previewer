/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Image as ImageIcon, 
  Video, 
  Youtube, 
  Instagram, 
  Twitter, 
  Facebook,
  Eye,
  Layout,
  Share2,
  LucideIcon,
  PlayCircle,
  FileImage,
  FileText,
  Wand2
} from "lucide-react";
import Link from "next/link";
import ThumbnailTester from "@/components/thumbnail/ThumbnailTester";

interface FloatingIconProps {
  children: React.ReactNode;
}

interface IconData {
  id: number;
  IconComponent: LucideIcon;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ children }) => {
  const controls = useAnimation();

  useEffect(() => {
    const randomDuration = 15 + Math.random() * 10;
    const randomDelay = Math.random() * 2;

    const animate = async () => {
      while (true) {
        await controls.start({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          rotate: Math.random() * 360,
          transition: {
            duration: randomDuration,
            ease: "linear",
            delay: randomDelay
          }
        });
      }
    };

    animate();
  }, [controls]);

  return (
    <motion.div
      animate={controls}
      initial={{
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: 0.3
      }}
      className="absolute pointer-events-none text-pink-500 dark:text-cyan-400"
    >
      <div className="w-16 h-16 flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [icons, setIcons] = useState<IconData[]>([]);

  const iconComponents = [
    ImageIcon, Video, Youtube,
    Layout, Share2
  ];

  useEffect(() => {
    const newIcons: IconData[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      IconComponent: iconComponents[Math.floor(Math.random() * iconComponents.length)]
    }));
    setIcons(newIcons);
  }, []);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  const featureVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-pink-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black">
      {/* Floating background icons */}
      {icons.map((icon) => (
        <FloatingIcon key={icon.id}>
          <icon.IconComponent size={32} />
        </FloatingIcon>
      ))}
  
      {/* Main content */}
      <div className="relative container mx-auto z-10 sm:my-24 my-16 bg-black/10 p-16 rounded-3xl shadow-xl">
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center space-y-12"
        >
          {/* Hero Section */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-4 mb-8"
          >
            <h1 className="text-4xl md:text-6xl highlight-mini drop-shadow-xl flex items-center gap-2 font-extrabold text-pink-500 dark:text-cyan-400">
              <Wand2 className="w-12 h-12 text-pink-600 dark:text-cyan-400" />
              Thumbnail Magic
            </h1>
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl max-w-2xl text-pink-800 dark:text-cyan-50"
          >
            Test your thumbnails across multiple platforms before publishing. Perfect for YouTube creators, social media managers, and digital content makers.
          </motion.p>
  
          {/* CTA Buttons */}
          <motion.div 
            variants={containerVariants}
            className="flex gap-6 flex-col sm:flex-row"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-pink-500 dark:bg-cyan-500 text-white rounded-full font-bold hover:bg-pink-600 dark:hover:bg-cyan-400 transition-all shadow-lg"
            >
              <Link href="/dashboard" className="flex items-center gap-3 ">
                Preview Your Thumbnail
                <motion.div whileHover={{ rotate: 12 }}>
                  <Eye className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-white/10 border-2 border-pink-500 dark:border-cyan-400 text-pink-500 dark:text-cyan-400 rounded-full font-bold flex items-center gap-3 hover:bg-pink-50 dark:hover:bg-cyan-950/20 transition-all"
            >
              How It Works
              <motion.div whileHover={{ scale: 1.1 }}>
                <PlayCircle className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Thumbnail Previewer */}
          <ThumbnailTester />
  
          {/* Features Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
          >
            {[
              {
                icon: <Youtube className="w-8 h-8" />,
                title: "YouTube Preview",
                description: "Test how your thumbnails appear in search results, suggested videos, and channel pages"
              },
              {
                icon: <Layout className="w-8 h-8" />,
                title: "Multi-Platform Testing",
                description: "Preview thumbnails across different devices and social media platforms"
              },
              {
                icon: <FileImage className="w-8 h-8" />,
                title: "File Support",
                description: "Support for images, PDFs, and various thumbnail formats with instant preview"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={featureVariants}
                whileHover="hover"
                className="bg-pink-50/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-xl hover:bg-pink-100/50 dark:hover:bg-cyan-900/20 transition-colors shadow-lg"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="mb-6 text-pink-500 dark:text-cyan-400"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-pink-900 dark:text-cyan-50">
                  {feature.title}
                </h3>
                <p className="text-pink-700 dark:text-cyan-200">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
  
          {/* Platform Support */}
          <motion.div
            variants={itemVariants}
            className="mt-8 bg-pink-50/50 dark:bg-black/50 backdrop-blur-sm p-10 rounded-2xl max-w-4xl w-full shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-8 text-pink-900 dark:text-cyan-50">
              Preview Across All Major Platforms
            </h3>
            <div className="flex justify-center gap-12 flex-wrap">
              {[Youtube, Instagram, Twitter, Facebook, FileText].map((Icon, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, opacity: 1 }}
                  className="text-pink-500 dark:text-cyan-400 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <Icon className="w-10 h-10" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}