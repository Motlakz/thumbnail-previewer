"use client"

import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { Upload, Smartphone, Monitor, Tablet, Maximize2, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Device, Platform, PREVIEW_DIMENSIONS, ThumbnailMetadata } from "@/types/platforms";
import YouTubePreview from "../previews/YouTubePreview";
import FacebookPreview from "../previews/FacebookPreview";
import InstagramPreview from "../previews/InstagramPreview";
import TwitterPreview from "../previews/TwitterPreview";
import ThumbnailMetadataForm from "./ThumbnailMetadataForm";
import ThumbnailEditor from "./ThumbnailEditor";
import Image from "next/image";
import Steps from "../demo/Steps";

export default function ThumbnailTester() {
    const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
    const [selectedDevice, setSelectedDevice] = useState<Device>("desktop");
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>("youtube");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showImageEditor, setShowImageEditor] = useState(false);
    const [metadata, setMetadata] = useState<ThumbnailMetadata>({
        title: "How I Built This Amazing Feature in Just 1 Hour!",
        channelName: "TechMaster Pro",
        subscribers: "1.2M subscribers",
        views: "254K views",
        uploadTime: "2 hours ago"
    });

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

    const handleMetadataChange = (field: string, value: string) => {
        setMetadata(prev => ({
            ...prev,
            [field]: value
        }));
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
        const dimensions = PREVIEW_DIMENSIONS[selectedPlatform][selectedDevice];
        
        if (isFullscreen) {
            return (
                <div 
                    className="fixed inset-0 z-50 bg-black/80"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                        setIsFullscreen(false);
                        }
                    }}
                >
                    <div className="min-h-screen px-4 py-8 flex items-center justify-center">
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg p-8 max-w-[95vw] overflow-y-auto">
                            {/* Close button */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-2 top-4 z-50"
                                onClick={() => setIsFullscreen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>

                            {/* Platform and device info */}
                            <div className="mb-4 text-center">
                                <h3 className="text-lg font-medium mb-1">
                                    {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} - {selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {dimensions.width} × {dimensions.height}
                                </p>
                            </div>

                            {/* Scrollable preview container */}
                            <div className="overflow-y-auto">
                                <div 
                                    style={{
                                        width: dimensions.width,
                                        height: dimensions.height,
                                        transform: `scale(${Math.min(
                                            (window.innerWidth * 0.9) / dimensions.width,
                                            (window.innerHeight * 0.8) / dimensions.height
                                        )})`,
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
                    className="bg-white dark:bg-gray-800 rounded-lg"
                    style={{
                        width: dimensions.width,
                        height: dimensions.height,
                        transform: 'scale(0.5)',
                        transformOrigin: 'top left',
                        margin: 'auto'
                    }}
                >
                    {children}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-0 w-8 h-8"
                    onClick={() => setIsFullscreen(true)}
                >
                    <Maximize2 />
                </Button>
            </div>
        );
    };

    const renderPreview = () => {
        const PreviewComponent = {
            youtube: YouTubePreview,
            facebook: FacebookPreview,
            instagram: InstagramPreview,
            twitter: TwitterPreview
        }[selectedPlatform];

        return (
            <PreviewWrapper>
                <PreviewComponent
                    thumbnailImage={thumbnailImage}
                    metadata={metadata}
                    device={selectedDevice}
                />
            </PreviewWrapper>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
                <Steps />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Controls */}
                    <div className="space-y-6">
                        {/* Platform Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Choose Platform</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs 
                                value={selectedPlatform}
                                onValueChange={(value) => setSelectedPlatform(value as Platform)}
                                className="w-full"
                                >
                                <TabsList className="grid grid-cols-4 w-full dark:bg-slate-800/50">
                                    <TabsTrigger value="youtube">YouTube</TabsTrigger>
                                    <TabsTrigger value="facebook">Facebook</TabsTrigger>
                                    <TabsTrigger value="instagram">Instagram</TabsTrigger>
                                    <TabsTrigger value="twitter">Twitter</TabsTrigger>
                                </TabsList>
                                </Tabs>
                            </CardContent>
                        </Card>

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
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowImageEditor(true)}
                                                className="mt-4 w-full"
                                            >
                                                Edit Image
                                            </Button>
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

                        {/* Metadata Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Post Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ThumbnailMetadataForm 
                                    metadata={metadata}
                                    onChange={handleMetadataChange}
                                    platform={selectedPlatform}
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
                                    Viewing at {PREVIEW_DIMENSIONS[selectedPlatform][selectedDevice].width} x {PREVIEW_DIMENSIONS[selectedPlatform][selectedDevice].height}
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
                                <div className="overflow-y-auto border rounded-lg p-4 bg-white dark:bg-gray-800">
                                    {renderPreview()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {showImageEditor && thumbnailImage && (
                        <ThumbnailEditor
                            imageUrl={thumbnailImage}
                            onSave={(editedImage) => {
                                setThumbnailImage(editedImage);
                                setShowImageEditor(false);
                            }}
                            onClose={() => setShowImageEditor(false)}
                        />
                    )}
                </div>
        </div>
    );
}
