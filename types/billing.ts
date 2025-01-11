export enum PlanId {
    BASIC = "BASIC",
    PREMIUM = "PREMIUM",
    PRO = "PRO",
}

export type Plan = {
    id: PlanId;
    name: string;
    label: string;
    price: number;
    priceId: string;
    features: string[];
    billing: 'one-time' | 'monthly';
};

export const Plans: Plan[] = [
    {
        id: PlanId.BASIC,
        name: "QuickPeek Basic",
        label: "Ideal for quick testing",
        price: 200,
        priceId: process.env.QUICK_PEEK_BASIC_PLAN!,
        features: [
            "5 thumbnail previews",
            "All platform testing",
            "Template library access",
            "Multi-device preview",
            "All file formats support",
            "Basic support",
        ],
        billing: 'one-time',
    },
    {
        id: PlanId.PREMIUM,
        name: "Vista Premium",
        label: "Ideal for creators",
        price: 1000,
        priceId: process.env.VISTA_PREMIUM_PLAN!,
        features: [
            "30 thumbnail previews",
            "All platform testing",
            "Template library access",
            "Multi-device preview",
            "Basic analytics",
            "All file formats support",
            "Priority support",
            "Bulk preview generation",
            "Saved previews for up to 7 days",
        ],
        billing: 'one-time',
    },
    {
        id: PlanId.PRO,
        name: "ThumbFlow Pro",
        label: "Suitable for regular content creators, marketers, and makers",
        price: 1500,
        priceId: process.env.THUMBFLOW_PRO_PLAN!,
        features: [
            "Unlimited thumbnail previews",
            "Unlimited platform testing",
            "Access to new features",
            "Advanced analytics",
            "No expiration date",
            "Trends analysis",
            "Preview editor",
            "Everything in Vista Premium",
        ],
        billing: 'monthly',
    },
];
