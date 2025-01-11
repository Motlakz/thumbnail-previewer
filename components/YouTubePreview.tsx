"use client";

import { motion } from "framer-motion";
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
                <motion.div
                    key={device}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
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
                
                    <div className="dark:text-white space-y-3">
                        <h3 className="font-semibold text-base sm:text-lg line-clamp-2 text-left">
                            {metadata.title || "Your Video Title"}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                {metadata.channelName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">{metadata.channelName || "Your Channel"}</p>
                                <p>{metadata.subscribers || "1M subscribers"}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{metadata.views || "100K views"}</span>
                            <span>•</span>
                            <span>{metadata.uploadTime || "2 hours ago"}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
