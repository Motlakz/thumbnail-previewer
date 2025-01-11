"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface YouTubePreviewProps {
    thumbnailImage: string | null;
    metadata: {
        title: string;
        channelName: string;
        subscribers: string;
        views: string;
        uploadTime: string;
    };
    device: "desktop" | "mobile" | "tablet";
}

const deviceConfigs = {
    desktop: {
        maxWidth: "max-w-4xl",
        aspectRatio: "aspect-video",
        imageWidth: 1280,
        imageHeight: 720
    },
    tablet: {
        maxWidth: "max-w-2xl",
        aspectRatio: "aspect-video",
        imageWidth: 960,
        imageHeight: 540
    },
    mobile: {
        maxWidth: "max-w-sm",
        aspectRatio: "aspect-video",
        imageWidth: 640,
        imageHeight: 360
    }
};

export default function YouTubePreview({ thumbnailImage, metadata, device }: YouTubePreviewProps) {
    const config = deviceConfigs[device];
    
    return (
        <div className="w-full px-4 sm:px-6 flex justify-center">
            <div className={`${config.maxWidth} w-full dark:bg-gray-900 bg-gray-50 rounded-xl p-4`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        className="space-y-3"
                        initial={false}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Thumbnail Container */}
                        <div className={`w-full ${config.aspectRatio} relative dark:bg-slate-800 bg-white rounded-xl overflow-hidden`}>
                            {thumbnailImage ? (
                                <Image
                                    src={thumbnailImage}
                                    alt="Thumbnail preview"
                                    fill
                                    className="object-cover"
                                    sizes={`(max-width: 640px) 100vw, 
                                           (max-width: 960px) 960px,
                                           1280px`}
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    <div className="text-center p-4">
                                        <ImageIcon className="w-12 h-12 mx-auto mb-4" />
                                        <p className="text-sm sm:text-base">Upload an image to preview your thumbnail</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content Container */}
                        <div className="flex gap-3">
                            {/* Channel Avatar */}
                            <div className="flex-shrink-0">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                    {metadata.channelName.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-grow min-w-0">
                                {/* Title */}
                                <h3 className="font-semibold text-base sm:text-lg line-clamp-2 text-left mb-1 dark:text-white">
                                    {metadata.title || "Your Video Title"}
                                </h3>

                                {/* Channel Name and Stats */}
                                <div className="text-sm text-muted-foreground">
                                    <p className="line-clamp-1">{metadata.channelName || "Your Channel"}</p>
                                    <div className="flex items-center gap-1">
                                        <span>{metadata.views || "100K views"}</span>
                                        <span>•</span>
                                        <span>{metadata.uploadTime || "2 hours ago"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
