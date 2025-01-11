import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, MessageSquare } from "lucide-react";
import { ThumbnailMetadata, Device } from "@/types/platforms";
import { IoLogoWhatsapp, IoClose } from "react-icons/io5";
import { FaGlobeAmericas, FaShare } from "react-icons/fa";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { HiHeart } from "react-icons/hi2";
import Image from "next/image";

interface FacebookPreviewProps {
    thumbnailImage: string | null;
    metadata: ThumbnailMetadata;
    device: Device;
}

export default function FacebookPreview({ thumbnailImage, metadata, device }: FacebookPreviewProps) {
    const containerStyles = {
        desktop: "max-w-xl",
        mobile: "max-w-sm",
        tablet: "max-w-lg"
    };

    const comments = [
        {
            author: "Simone Deveraux",
            content: "This is over the top 😭😭 You make some really Boss content!",
            avatar: "SD"
        },
    ];

    return (
        <Card className={`mx-auto ${containerStyles[device]}`}>
            <CardHeader className="space-y-0 p-4">
                <div className="flex justify-between">
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarFallback>
                                {metadata.channelName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm">
                                {metadata.channelName}
                            </span>
                            <span className="text-xs text-left text-muted-foreground">
                                <span className="font-medium">4h</span> · <FaGlobeAmericas className="h-3 w-3 inline" /> Public
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <BsThreeDots className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <IoClose className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-4">
                {/* Post Text */}
                <p className="text-md text-left">{metadata.title}</p>

                {/* Thumbnail Image */}
                {thumbnailImage ? (
                    <div className="relative w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                            src={thumbnailImage}
                            alt="Post thumbnail"
                            className="w-full h-full object-cover"
                            width={800}
                            height={400}
                        />
                    </div>
                ) : (
                    <div className="relative w-full h-64 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400">No image uploaded</span>
                    </div>
                )}

                {/* Engagement Stats */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex">
                            <span className="bg-blue-500 border-2 dark:border-slate-900 p-1 rounded-full">
                                <AiFillLike className="h-4 w-4 text-white" />
                            </span>
                            <span className="bg-red-500 border-2 dark:border-slate-900 p-1 rounded-full -ml-2">
                                <HiHeart className="h-4 w-4 text-white" />
                            </span>
                        </div>
                        <span className="text-sm text-gray-400 ml-2">{metadata.likes}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-400">{metadata.comments}</span>
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-400">{metadata.shares}</span>
                            <FaShare className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex pt-3 justify-between border-t border-gray-700">
                    <Button variant="ghost" size="sm" className="flex-1 text-gray-400">
                        <AiOutlineLike className="h-4 w-4 mr-2" />
                        Like
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-gray-400">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Comment
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-gray-400">
                        <IoLogoWhatsapp className="h-4 w-4 mr-2" />
                        Send
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-gray-400">
                        <FaShare className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                </div>

                {/* Comments Section */}
                <div className="space-y-4 pt-2 border-t border-gray-700">
                    {comments.map((comment, index) => (
                        <div key={index} className="flex gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gray-600 text-sm text-white">
                                    {comment.avatar}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="text-left bg-gray-200 dark:bg-gray-200/10 rounded-2xl px-3 py-2">
                                    <p className="font-semibold text-sm mb-1">{comment.author}</p>
                                    <p className="text-sm">{comment.content}</p>
                                </div>
                                <div className="flex gap-4 mt-1 ml-3">
                                    <span className="text-gray-400 text-xs">1h</span>
                                    <button className="text-gray-400 text-xs font-semibold hover:underline">
                                        Like
                                    </button>
                                    <button className="text-gray-400 text-xs font-semibold hover:underline">
                                        Reply
                                    </button>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 mt-4 rounded-full self-start">
                                <BsThreeDots className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
