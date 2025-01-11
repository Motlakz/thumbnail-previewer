"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface ThumbnailPreviewProps {
    thumbnailImage: string | null;
    device: "desktop" | "mobile" | "tablet";
}

const deviceDimensions = {
    desktop: { width: "w-full", height: "h-[480px]" },
    mobile: { width: "w-[320px]", height: "h-[180px]" },
    tablet: { width: "w-[600px]", height: "h-[338px]" },
};

export default function ThumbnailPreview({ thumbnailImage, device }: ThumbnailPreviewProps) {
    const { width, height } = deviceDimensions[device];

    return (
        <div className="flex justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={device}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className={`${width} ${height} dark:bg-slate-700 bg-slate-400 rounded-lg overflow-hidden relative`}
                >
                    {thumbnailImage ? (
                        <Image
                            src={thumbnailImage}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                            width={device === "desktop" ? 1920 : device === "tablet" ? 600 : 320}
                            height={device === "desktop" ? 1080 : device === "tablet" ? 338 : 180}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <ImageIcon className="w-12 h-12 mx-auto mb-4" />
                                <p>Upload an image to preview your thumbnail</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
