/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { 
  Image as ImageIcon, 
  Video, 
  Youtube, 
  Layout, 
  Share2,
  // Eye,
  Wand2,
  PlayCircle,
  LucideIcon
} from "lucide-react";
// import Link from "next/link";
import VideoDemo from "@/components/demo/VideoDemo";
import Features from "@/components/Features";
import DemoPreviewer from "@/components/demo/Previewer";

interface FloatingIconProps {
  children: ReactNode;
}

interface IconData {
  id: number;
  IconComponent: LucideIcon;
}

function FloatingIcon({ children }: FloatingIconProps) {
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
      className="absolute pointer-events-none text-pink-300 dark:text-cyan-400"
    >
      <div className="w-16 h-16 flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [icons, setIcons] = useState<IconData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-pink-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black">
      {icons.map((icon) => (
        <FloatingIcon key={icon.id}>
          <icon.IconComponent size={32} />
        </FloatingIcon>
      ))}
  
      <div className="relative container mx-auto z-10 sm:my-24 my-16 bg-black/10 p-8 rounded-3xl shadow-xl">
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center space-y-12"
        >
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
  
          <motion.div 
            variants={containerVariants}
            className="flex gap-6 flex-col sm:flex-row"
          >
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-pink-500 dark:bg-cyan-500 text-white rounded-full font-bold hover:bg-pink-600 dark:hover:bg-cyan-400 transition-all shadow-lg"
            >
              <Link href="/dashboard" className="highlight-mini flex items-center gap-3">
                Preview Your Thumbnail
                <motion.div whileHover={{ rotate: 12 }}>
                  <Eye className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.button> */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="group px-8 py-4 bg-white/10 border-2 border-pink-500 dark:border-cyan-400 text-pink-500 dark:text-cyan-400 rounded-full font-bold flex items-center gap-3 hover:bg-pink-50 dark:hover:bg-cyan-950/20 transition-all"
            >
              How It Works
              <motion.div whileHover={{ scale: 1.1 }}>
                <PlayCircle className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.div>

          <DemoPreviewer />
          <Features />
        </motion.main>
      </div>

      <VideoDemo isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-6 text-gray-700 dark:text-gray-200">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">1. Upload Your Thumbnail</h3>
            <p>Simply drag and drop your thumbnail image or click to upload. We support various image formats including JPG, PNG, and WebP.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">2. Preview Across Platforms</h3>
            <p>See how your thumbnail appears across different platforms including YouTube, Instagram, Twitter, and Facebook.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">3. Optimize and Adjust</h3>
            <p>Make informed decisions about your thumbnail based on how it appears in different contexts and sizes.</p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Start previewing your thumbnails now to ensure they look perfect across all platforms!
            </p>
          </div>
        </div>
      </VideoDemo>
    </div>
  );
}
