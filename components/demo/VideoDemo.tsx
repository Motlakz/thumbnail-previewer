import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface VideoDemoProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const VideoDemo = ({ isOpen, onClose, children }: VideoDemoProps) => {
  const VideoDemoVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col"
        variants={VideoDemoVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-pink-500 dark:text-cyan-400">
            How It Works
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="space-y-6">
            {/* Video Section */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-2xl aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                <video
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                  muted
                  playsInline
                  src="/demo/thumbnail_demo.mp4"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6 text-gray-700 dark:text-gray-200">
              {children}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VideoDemo;
