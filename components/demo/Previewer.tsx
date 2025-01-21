"use client"

import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { Upload, Smartphone, Monitor, Tablet, Maximize2, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Device, PREVIEW_DIMENSIONS, ThumbnailMetadata } from "@/types/platforms";
import YouTubePreview from "../previews/YouTubePreview";
import Image from "next/image";

const DEFAULT_METADATA: ThumbnailMetadata = {
    title: "How I Built This Amazing Feature in Just 1 Hour!",
    channelName: "TechMaster Pro",
    subscribers: "1.2M subscribers",
    views: "254K views",
    uploadTime: "2 hours ago"
};

export default function DemoPreviewer() {
    const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
    const [selectedDevice, setSelectedDevice] = useState<Device>("desktop");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const metadata = DEFAULT_METADATA;

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsFullscreen(false);
            }
        };

        if (isFullscreen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isFullscreen]);

    const PreviewWrapper = ({ children }: { children: ReactNode }) => {
        const dimensions = PREVIEW_DIMENSIONS["youtube"][selectedDevice]; // Only YouTube platform
        
        if (isFullscreen) {
            return (
                <div 
                    className="fixed inset-0 z-50 bg-black/80 overflow-hidden"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsFullscreen(false);
                        }
                    }}
                >
                    <div className="h-screen w-full flex items-center justify-center p-4">
                        <div className="relative bg-white dark:bg-slate-800 rounded-lg p-8 mt-24 max-h-[95vh] w-auto">
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-2 top-4 z-50 dark:hover:bg-slate-900"
                                onClick={() => setIsFullscreen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
    
                            <div className="mb-4 text-left">
                                <h3 className="text-lg font-medium mb-1">
                                    YouTube - {selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {dimensions.width} × {dimensions.height}
                                </p>
                            </div>
    
                            <div className="relative overflow-auto custom-scrollbar"
                                 style={{
                                     maxHeight: 'calc(95vh - 120px)',
                                     maxWidth: '95vw',
                                 }}
                            >
                                <div 
                                    className="transform-gpu"
                                    style={{
                                        width: dimensions.width,
                                        height: dimensions.height,
                                        transform: `scale(${Math.min(
                                            (window.innerWidth * 0.85) / dimensions.width,
                                            (window.innerHeight * 0.75) / dimensions.height
                                        ) * 1.25}`, // 1.25x zoom factor
                                        transformOrigin: 'top center',
                                    }}
                                >
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    
        return (
            <div className="relative">
                <div 
                    className="bg-white dark:bg-slate-800 rounded-lg"
                    style={{
                        width: dimensions.width,
                        height: dimensions.height,
                        transform: 'scale(0.5)',
                        transformOrigin: 'top center',
                        margin: 'auto'
                    }}
                >
                    {children}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-0 left-0 w-8 h-8 dark:hover:bg-slate-900"
                    onClick={() => setIsFullscreen(true)}
                >
                    <Maximize2 />
                </Button>
            </div>
        );
    };

    const renderPreview = () => {
        return (
            <PreviewWrapper>
                <YouTubePreview
                    thumbnailImage={thumbnailImage}
                    metadata={metadata}
                    device={selectedDevice}
                />
            </PreviewWrapper>
        );
    };

    return (
        <div className="min-h-screen max-w-7xl w-full bg-gray-50 dark:bg-slate-900 py-8 px-4 rounded-md">
            <div className="flex flex-col gap-4">
                {/* Left Column - Controls */}
                <div className="space-y-6">
                    {/* Thumbnail Upload */}
                    <Card className="pb-12">
                        <CardHeader>
                            <CardTitle>Upload Thumbnail</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label 
                                htmlFor="thumbnail-upload"
                                className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                {thumbnailImage ? (
                                    <div className="relative w-full h-full">
                                        <Image 
                                            src={thumbnailImage} 
                                            alt="Thumbnail preview" 
                                            className="w-full h-full object-contain rounded-lg"
                                            width={800}
                                            height={400}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                            <span className="text-white">Change Image</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click to upload thumbnail image</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                                    </>
                                )}
                            </Label>
                            <Input
                                id="thumbnail-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Preview */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <p className="text-sm text-gray-500">
                                Viewing at {PREVIEW_DIMENSIONS["youtube"][selectedDevice].width} x {PREVIEW_DIMENSIONS["youtube"][selectedDevice].height}
                            </p>
                        </CardHeader>
                        <CardContent>
                            {/* Device Selection */}
                            <div className="mb-6">
                                <Tabs 
                                    value={selectedDevice}
                                    onValueChange={(value) => setSelectedDevice(value as Device)}
                                    className="w-full"
                                >
                                    <TabsList className="grid grid-cols-3 w-full dark:bg-slate-800/50">
                                        <TabsTrigger value="desktop" className="flex items-center gap-2">
                                            <Monitor className="h-4 w-4" />
                                            Desktop
                                        </TabsTrigger>
                                        <TabsTrigger value="tablet" className="flex items-center gap-2">
                                            <Tablet className="h-4 w-4" />
                                            Tablet
                                        </TabsTrigger>
                                        <TabsTrigger value="mobile" className="flex items-center gap-2">
                                            <Smartphone className="h-4 w-4" />
                                            Mobile
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            {/* Preview Area with Fixed Dimensions */}
                            <div className="overflow-y-auto border rounded-lg p-4 bg-white dark:bg-slate-800">
                                {renderPreview()}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}