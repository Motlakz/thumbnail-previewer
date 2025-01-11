export type Platform = "youtube" | "facebook" | "instagram" | "twitter";
export type Device = "desktop" | "mobile" | "tablet";

export interface ThumbnailMetadata {
    title: string;
    channelName: string;
    subscribers: string;
    views: string;
    uploadTime: string;
    likes?: string;
    comments?: string;
    shares?: string;
    location?: string;
}

// Define precise dimensions for each platform and device type
export const PREVIEW_DIMENSIONS = {
    youtube: {
        desktop: { width: 1280, height: 720 },
        mobile: { width: 360, height: 640 },
        tablet: { width: 768, height: 1024 }
    },
    facebook: {
        desktop: { width: 1200, height: 1024 },
        mobile: { width: 360, height: 1024 },
        tablet: { width: 768, height: 1024 }
    },
    instagram: {
        desktop: { width: 1080, height: 1024 },
        mobile: { width: 360, height: 640 },
        tablet: { width: 768, height: 1024 }
    },
    twitter: {
        desktop: { width: 1200, height: 1024 },
        mobile: { width: 360, height: 640 },
        tablet: { width: 768, height: 1024 }
    }
};
