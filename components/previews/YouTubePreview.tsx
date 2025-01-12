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
        description?: string;
    };
    device: "desktop" | "mobile" | "tablet";
}

const deviceConfigs = {
    desktop: {
        contentWidth: "w-full max-w-[1280px]",
        thumbnailSize: "aspect-video",
        gridLayout: "grid-cols-1 xl:grid-cols-2",
        textSize: {
            title: "text-base xl:text-lg",
            subtitle: "",
            body: ""
        },
        spacing: {
            container: "gap-4 xl:gap-6",
            elements: "gap-3 xl:gap-4"
        },
        searchView: {
            layout: "flex-col md:flex-row",
            thumbnailWidth: "w-full md:w-[360px] xl:w-[480px]",
            contentLayout: "flex flex-col gap-1 xl:gap-3"
        },
        suggestedView: {
            thumbnailWidth: "w-[168px] xl:w-[240px]",
            layout: "flex gap-1 xl:gap-3"
        },
        defaultView: {
            infoLayout: "flex flex-col gap-1"
        }
    },
    tablet: {
        contentWidth: "w-full max-w-[768px]",
        thumbnailSize: "aspect-video",
        gridLayout: "grid-cols-1",
        textSize: {
            title: "text-base",
            subtitle: "",
            body: ""
        },
        spacing: {
            container: "gap-4",
            elements: "gap-3"
        },
        searchView: {
            layout: "flex-col sm:flex-row",
            thumbnailWidth: "w-full sm:w-[280px]",
            contentLayout: "flex flex-col gap-1"
        },
        suggestedView: {
            thumbnailWidth: "w-[140px]",
            layout: "flex gap-1"
        },
        defaultView: {
            infoLayout: "flex flex-col gap-1"
        }
    },
    mobile: {
        contentWidth: "w-full max-w-[360px]",
        thumbnailSize: "aspect-video",
        gridLayout: "grid-cols-1",
        textSize: {
            title: "",
            subtitle: "",
            body: ""
        },
        spacing: {
            container: "gap-3",
            elements: "gap-1"
        },
        searchView: {
            layout: "flex-col",
            thumbnailWidth: "w-full",
            contentLayout: "flex flex-col gap-1.5"
        },
        suggestedView: {
            thumbnailWidth: "w-[120px]",
            layout: "flex gap-1"
        },
        defaultView: {
            infoLayout: "flex flex-col gap-1.5"
        }
    }
};

export default function YouTubePreview({ thumbnailImage, metadata, device }: YouTubePreviewProps) {
    const config = deviceConfigs[device];

    const renderThumbnail = (customClass = "") => (
        <div className={`relative ${config.thumbnailSize} ${customClass} dark:bg-slate-800 bg-white rounded-lg overflow-hidden`}>
            {thumbnailImage ? (
                <Image
                    src={thumbnailImage}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 360px) 100vw, (max-width: 768px) 768px, 1280px"
                    priority
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <div className="text-center p-4">
                        <ImageIcon className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2" />
                        <p className={config.textSize.body}>Upload thumbnail</p>
                    </div>
                </div>
            )}
        </div>
    );

    const MetadataDisplay = () => (
        <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
            <span>{metadata.views}</span>
            <span>•</span>
            <span>{metadata.uploadTime}</span>
        </div>
    );

    return (
        <div className={`p-3 md:p-4 space-y-6 md:space-y-8 ${config.contentWidth}`}>
            <div className={`grid ${config.gridLayout} ${config.spacing.container}`}>
                {/* Default View */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 md:p-4">
                    <h2 className={`${config.textSize.title} font-semibold mb-3 md:mb-4 dark:text-white`}>Default View</h2>
                    <motion.div className="space-y-3 md:space-y-4">
                        {renderThumbnail()}
                        <div className="flex gap-1 md:gap-3">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                    {metadata.channelName.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className={config.defaultView.infoLayout}>
                                <h3 className={`${config.textSize.title} font-semibold line-clamp-2 dark:text-white`}>
                                    {metadata.title}
                                </h3>
                                <p className={`${config.textSize.body} text-muted-foreground line-clamp-1`}>
                                    {metadata.channelName}
                                </p>
                                <MetadataDisplay />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Search View */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 md:p-4">
                    <h2 className={`${config.textSize.title} font-semibold mb-3 md:mb-4 dark:text-white`}>Search View</h2>
                    <motion.div className={`flex ${config.searchView.layout} gap-3 md:gap-4`}>
                        <div className={config.searchView.thumbnailWidth}>
                            {renderThumbnail()}
                        </div>
                        <div className={config.searchView.contentLayout}>
                            <h3 className={`${config.textSize.title} font-semibold line-clamp-2 dark:text-white`}>
                                {metadata.title}
                            </h3>
                            <MetadataDisplay />
                            <div className="flex items-center gap-1">
                                <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                                    {metadata.channelName.charAt(0)}
                                </div>
                                <span className={`${config.textSize.body} text-muted-foreground`}>
                                    {metadata.channelName}
                                </span>
                            </div>
                            {metadata.description && (
                                <p className={`${config.textSize.body} text-muted-foreground line-clamp-2`}>
                                    {metadata.description}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Suggested View */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 md:p-4">
                    <h2 className={`${config.textSize.title} font-semibold mb-3 md:mb-4 dark:text-white`}>Suggested View</h2>
                    <motion.div className={config.suggestedView.layout}>
                        <div className={config.suggestedView.thumbnailWidth}>
                            {renderThumbnail()}
                        </div>
                        <div className="flex-1 ml-2 min-w-0">
                            <h3 className={`${config.textSize.subtitle} font-medium line-clamp-2 mb-1 dark:text-white`}>
                                {metadata.title}
                            </h3>
                            <p className={`${config.textSize.body} text-muted-foreground line-clamp-1`}>
                                {metadata.channelName}
                            </p>
                            <MetadataDisplay />
                        </div>
                    </motion.div>
                </div>

                {/* Channel View */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 md:p-4">
                    <h2 className={`${config.textSize.title} font-semibold mb-3 md:mb-4 dark:text-white`}>Channel View</h2>
                    <motion.div className="space-y-2 md:space-y-3">
                        {renderThumbnail()}
                        <div className="space-y-1 md:space-y-1.5">
                            <h3 className={`${config.textSize.subtitle} font-medium line-clamp-2 dark:text-white`}>
                                {metadata.title}
                            </h3>
                            <MetadataDisplay />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
