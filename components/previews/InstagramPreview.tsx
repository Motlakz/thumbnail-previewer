"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark, Send, Smile, ImageIcon } from "lucide-react";
import { ThumbnailMetadata, Device } from "@/types/platforms";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface InstagramPreviewProps {
    thumbnailImage: string | null;
    metadata: ThumbnailMetadata;
    device: Device;
}

export default function InstagramPreview({ thumbnailImage, metadata, device }: InstagramPreviewProps) {
    const containerStyles = {
        desktop: "max-w-xl",
        mobile: "max-w-sm",
        tablet: "max-w-lg"
    };

    return (
        <Card className={cn("mx-auto overflow-hidden", containerStyles[device])}>
            <CardHeader className="space-y-0 p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-purple-600">
                            <Avatar className="h-8 w-8 border-2 border-background">
                                <AvatarFallback className="text-xs">
                                    {metadata.channelName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm">
                                {metadata.channelName}
                            </span>
                            {metadata.location && (
                                <span className="text-xs text-left text-muted-foreground">
                                    {metadata.location}
                                </span>
                            )}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="sr-only">More options</span>
                        <span className="text-xl leading-none">•••</span>
                    </Button>
                </div>
            </CardHeader>

            {/* Image */}
            {thumbnailImage ? (
                <div className="relative aspect-square">
                    <Image
                        src={thumbnailImage}
                        alt="Instagram post"
                        className="absolute h-full w-full object-cover"
                        width={640}
                        height={640}
                    />
                </div>
            ) : (
                <div className="relative w-full h-64 rounded-xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center">
                    <ImageIcon className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2" />
                    <span className="text-gray-400">Upload Thumbnail</span>
                </div>
            )}

            <CardContent className="p-3 space-y-3">
                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Heart className="h-6 w-6" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MessageCircle className="h-6 w-6" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Send className="h-6 w-6" />
                        </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bookmark className="h-6 w-6" />
                    </Button>
                </div>

                {/* Likes */}
                <div className="space-y-1 text-left">
                    <p className="font-semibold text-sm">
                        {metadata.likes || '0'} likes
                    </p>

                    {/* Caption */}
                    <p className="text-sm">
                        <span className="font-semibold mr-2">{metadata.channelName}</span>
                        {metadata.title}
                    </p>

                    {/* View Comments */}
                    <button className="text-sm text-muted-foreground">
                        View all {metadata.comments || '15'} comments
                    </button>

                    {/* Timestamp */}
                    <p className="text-sm pb-2 flex justify-between items-center text-muted-foreground border-b">
                        <span>Add a comment...</span>
                        <Smile className="h-4 w-4" />
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
