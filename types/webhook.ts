/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WebhookPayloadData {
    items: {
        id: string;
        name: string;
        quantity: number;
        internalId: string | null;
        plan?: null;
        offer?: {
            id: string;
            object: string;
            internalId: string | null;
        };
        value: number;
        object: string;
        product?: {
            id: string;
            object: string;
            internalId: string | null;
        };
        variant?: string | null;
        customFields?: {
            appwrite_user_id?: string;
            [key: string]: any;
        };
    }[];
    order: {
        id: string;
        fee: number;
        tax: number;
        value: number;
        currency: string;
        totalItems: number;
        orderNumber: string;
        status: string;
        createdAt: number;
        userId: string;
        country: string;
        currencyDecimals: number;
    };
    payment: {
        id: string;
        fee: number;
        tax: number;
        type: string;
        value: number;
        status: string;
        userId: string;
        orderId: string;
        currency: string;
        createdAt: number;
        orderNumber: string;
        currencyDecimals: number;
    };
    customer: {
        id: string;
        email: string;
        object: string;
        username: string;
        internalId: string | null;
    };
}

export interface WebhookPayload {
    id: string;
    data: WebhookPayloadData;
    type: 'payment_success' | 'payment_failed' | 'payment_refunded' | 'subscription_created' | 'subscription_interval' | 'subscription_updated' | 'subscription_cancelled';
    idempotencyKey: string;
}
