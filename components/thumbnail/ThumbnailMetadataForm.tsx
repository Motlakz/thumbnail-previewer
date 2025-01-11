"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ThumbnailMetadataFormProps {
    metadata: {
        title: string;
        channelName: string;
        subscribers: string;
        views: string;
        uploadTime: string;
        description?: string;
        likes?: string;
        comments?: string;
        shares?: string;
        location?: string;
    };
    onChange: (field: string, value: string) => void;
    platform: "youtube" | "facebook" | "instagram" | "twitter";
}

export default function ThumbnailMetadataForm({ metadata, onChange, platform }: ThumbnailMetadataFormProps) {
    const renderInput = (id: string, label: string, value: string | undefined, placeholder: string) => (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-white">{label}</Label>
            <Input
                id={id}
                value={value ?? ''}
                onChange={(e) => onChange(id, e.target.value)}
                className="dark:bg-slate-700 border dark:border-slate-600 dark:text-white"
                placeholder={placeholder}
            />
        </div>
    );

    const renderTextArea = (id: string, label: string, value: string | undefined, placeholder: string) => (
        <div className="space-y-2 col-span-full mb-4">
            <Label htmlFor={id} className="text-white">{label}</Label>
            <Textarea
                id={id}
                value={value ?? ''}
                onChange={(e) => onChange(id, e.target.value)}
                className="dark:bg-slate-700 border dark:border-slate-600 dark:text-white min-h-[100px]"
                placeholder={placeholder}
            />
        </div>
    );

    const renderFields = () => {
        switch (platform) {
            case "youtube":
                return (
                    <>
                        {renderTextArea("title", "Video Title", metadata.title, "Your Video Title")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderInput("channelName", "Channel Name", metadata.channelName, "Your Channel")}
                            {renderInput("subscribers", "Subscribers", metadata.subscribers, "1M subscribers")}
                            {renderInput("views", "Views", metadata.views, "100K views")}
                            {renderInput("uploadTime", "Upload Time", metadata.uploadTime, "2 hours ago")}
                        </div>
                    </>
                );

            case "facebook":
                return (
                    <>
                        {renderTextArea("title", "Post Text", metadata.title, "What's on your mind?")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderInput("channelName", "Page Name", metadata.channelName, "Your Page Name")}
                            {renderInput("likes", "Likes", metadata.likes, "1.5K")}
                            {renderInput("comments", "Comments", metadata.comments, "245")}
                            {renderInput("shares", "Shares", metadata.shares, "50")}
                        </div>
                    </>
                );

            case "instagram":
                return (
                    <>
                        {renderTextArea("title", "Caption", metadata.title, "Write a caption...")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderInput("channelName", "Username", metadata.channelName, "@username")}
                            {renderInput("likes", "Likes", metadata.likes, "1,234")}
                            {renderInput("location", "Location", metadata.location, "Add location")}
                        </div>
                    </>
                );

            case "twitter":
                return (
                    <>
                        {renderTextArea("title", "Tweet Text", metadata.title, "What's happening?")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderInput("channelName", "Username", metadata.channelName, "@username")}
                            {renderInput("uploadTime", "Time", metadata.uploadTime, "2h")}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="space-y-4 mb-8">
            {renderFields()}
        </div>
    );
}
