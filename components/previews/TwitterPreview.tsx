"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Bookmark } from "lucide-react";
import { IoStatsChartSharp } from "react-icons/io5";
import { ThumbnailMetadata, Device } from "@/types/platforms";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface TwitterPreviewProps {
    thumbnailImage: string | null;
    metadata: ThumbnailMetadata;
    device: Device;
}

interface EngagementButtonProps {
    icon: React.ReactNode;
    count?: string;
    color?: 'blue' | 'green' | 'red' | 'default'; // Define specific color options
}

const EngagementButton = ({ icon, count, color = 'default' }: EngagementButtonProps) => {
    const hoverColorClasses = {
        blue: 'hover:text-blue-500 hover:bg-blue-500/20',
        green: 'hover:text-green-500 hover:bg-green-500/20',
        red: 'hover:text-red-500 hover:bg-red-500/20',
        default: 'hover:text-gray-900 hover:bg-gray-500/20'
    };

    return (
        <button 
            className={cn(
                "flex items-center gap-1 p-2 rounded-full transition-colors",
                "text-gray-500",
                hoverColorClasses[color]
            )}
        >
            <div className="transition-colors">
                {icon}
            </div>
            {count && <span className="text-xs">{count}</span>}
        </button>
    );
};

export default function TwitterPreview({ thumbnailImage, metadata, device }: TwitterPreviewProps) {
    const containerStyles = {
        desktop: "max-w-xl",
        mobile: "max-w-sm",
        tablet: "max-w-lg"
    };

    const username = metadata.channelName.toLowerCase().replace(/\s/g, '');

    return (
        <Card className={cn("mx-auto w-full", containerStyles[device])}>
            <CardContent className="p-2 sm:p-4">
                <div className="flex gap-2 sm:gap-4">
                    {/* Left Column - Avatar */}
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                        <AvatarFallback>
                            {metadata.channelName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {/* Right Column - Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col sm:flex-row sm:items-center min-w-0 flex-1">
                                <div className="flex items-center gap-1 sm:gap-2 min-w-0 max-w-full">
                                    <span className="font-semibold text-sm truncate hover:underline max-w-[40%]">
                                        {metadata.channelName}
                                    </span>
                                    <span className="text-muted-foreground text-xs sm:text-sm truncate overflow-hidden text-ellipsis max-w-[40%]">
                                        @{username}
                                    </span>
                                    <span className="text-muted-foreground text-xs sm:text-sm whitespace-nowrap">
                                        · {metadata.uploadTime}
                                    </span>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Tweet Content */}
                        <p className="text-sm mb-3 text-left sm:text-[15px] whitespace-pre-wrap break-words">
                            {metadata.title}
                        </p>

                        {/* Image */}
                        {thumbnailImage && (
                            <div className="rounded-xl overflow-hidden border border-border">
                                <Image
                                    src={thumbnailImage}
                                    alt="Tweet image"
                                    className="w-full h-auto object-cover"
                                    height={400}
                                    width={800}
                                />
                            </div>
                        )}

                        {/* Engagement Buttons */}
                        <div className="flex justify-between pt-2 sm:pt-3">
                            <EngagementButton 
                                icon={<MessageCircle className="h-4 w-4" />}
                                count="24"
                                color="blue"
                            />
                            <EngagementButton 
                                icon={<Repeat2 className="h-4 w-4" />}
                                count="12"
                                color="green"
                            />
                            <EngagementButton 
                                icon={<Heart className="h-4 w-4" />}
                                count={metadata.likes || "148"}
                                color="red"
                            />
                            <EngagementButton 
                                icon={<IoStatsChartSharp className="h-4 w-4" />}
                                count="20K"
                                color="blue"
                            />
                            <div className="corner-btns flex gap-2">
                                <EngagementButton 
                                    icon={<Bookmark className="h-4 w-4" />}
                                    color="blue"
                                />
                                <EngagementButton 
                                    icon={<Share className="h-4 w-4" />}
                                    color="blue"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
