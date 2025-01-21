import { motion, Variants } from "framer-motion";
import Image from "next/image";
import {
  Monitor,
  Laptop,
  Smartphone,
  ArrowRight,
  Youtube,
  Instagram,
  Twitter,
  Facebook,
  Upload,
  Layout,
  Pencil,
  Eye,
} from "lucide-react";
import { Children, ReactNode } from "react";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.4, 0.02, 0.2, 1]
    }
  }
};

const imageVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    x: -50
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 1,
      ease: "easeOut"
    }
  }
};

const contentVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: 50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

const iconVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "backOut"
    }
  },
  hover: {
    scale: 1.2,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

interface FeatureCardProps {
  imageUrl: string;
  title: string;
  description: string;
  icons?: ReactNode;
  ctaButton?: ReactNode;
  isReversed?: boolean;
}

function FeatureCard({
  imageUrl,
  title,
  description,
  icons,
  ctaButton,
  isReversed = false
}: FeatureCardProps) {
  const flexDirection = isReversed ? "md:flex-row-reverse" : "md:flex-row";

  return (
    <motion.div 
      variants={itemVariants}
      className={`flex flex-col ${flexDirection} items-center gap-8`}
      whileInView="visible"
      initial="hidden"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div 
        className="flex-1 relative"
        variants={imageVariants}
      >
        <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-${isReversed ? 'l' : 'r'} from-pink-500/20 to-transparent dark:from-cyan-500/20`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </div>
      </motion.div>

      <motion.div 
        className="flex-1 space-y-4"
        variants={contentVariants}
      >
        <motion.h3 
          className="text-2xl font-bold text-pink-800 dark:text-cyan-300"
          variants={itemVariants}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-lg text-pink-700 dark:text-cyan-100"
          variants={itemVariants}
        >
          {description}
        </motion.p>

        {icons && (
          <motion.div 
            className="flex gap-4 items-center justify-center flex-wrap"
            variants={contentVariants}
          >
            {Children.map(icons, (icon, index) => (
              <motion.div
                key={index}
                variants={iconVariants}
                whileHover="hover"
                custom={index}
              >
                {icon}
              </motion.div>
            ))}
          </motion.div>
        )}

        {ctaButton && (
          <motion.div
            className="flex justify-center"
            variants={itemVariants}
            whileHover={{ x: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {ctaButton}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

const Features = () => {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-24 max-w-6xl mx-auto px-4"
    >
      <motion.h2 
        variants={itemVariants}
        className="text-3xl md:text-4xl font-bold text-center mb-16 text-pink-900 dark:text-cyan-50"
      >
        Powerful Features for Content Creators
      </motion.h2>

      <div className="space-y-24">
        <FeatureCard
          imageUrl="/cutesy_create.png"
          title="Upload & Choose Platform"
          description="Start by uploading your thumbnail and selecting your target social media platform. Our system automatically adjusts to the optimal dimensions and requirements."
          icons={
            <div className="flex gap-4">
              <Upload className="w-6 h-6 text-pink-500 dark:text-cyan-400" />
              <Youtube className="w-6 h-6 text-pink-500 dark:text-cyan-400" />
              <Instagram className="w-6 h-6 text-pink-500 dark:text-cyan-400" />
              <Facebook className="w-6 h-6 text-pink-500 dark:text-cyan-400" />
              <Twitter className="w-6 h-6 text-pink-500 dark:text-cyan-400" />
            </div>
          }
        />

        <FeatureCard
          imageUrl="/cutesy_thumbnail_logo.png"
          title="Multi-Device Preview"
          description="Instantly see how your thumbnail appears across different devices and platforms. Ensure perfect visibility on phones, tablets, and desktops."
          isReversed
          icons={
            <div className="flex gap-4">
              <Monitor className="w-6 h-6 text-pink-500 dark:text-cyan-400" />
              <Laptop className="w-6 h-6 text-pink-500 dark:text-cyan-400" />
              <Smartphone className="w-6 h-6 text-pink-500 dark:text-cyan-400" />
            </div>
          }
        />

        <FeatureCard
          imageUrl="/cutesy_features.png"
          title="Customize & Edit"
          description="Fine-tune your thumbnail with our built-in editor. Adjust layouts, add text, and customize content to match your brand's style."
          icons={
            <div className="flex gap-4">
              <Layout className="w-6 h-6 text-pink-500 dark:text-cyan-400" />
              <Pencil className="w-6 h-6 text-pink-500 dark:text-cyan-400" />
              <Eye className="w-6 h-6 text-pink-500 dark:text-cyan-400" />
            </div>
          }
          ctaButton={
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-pink-500 dark:text-cyan-400"
            >
              <Link href="/register" className="flex items-center gap-2">Preview your thumbnails now <ArrowRight className="w-4 h-4" /></Link>
            </motion.button>
          }
        />
      </div>
    </motion.section>
  );
};

export default Features;