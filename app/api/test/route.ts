import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Plan, Plans } from "@/types/billing";
import prisma from "@/lib/db";
import { Client, ID, Query, Users } from "node-appwrite"
import { verifySignature, WEBHOOK_SECRET } from "@/lib/helper/verify";
import { WebhookPayload } from "@/types/webhook";

const client = new Client()
const users = new Users(client);

if (!WEBHOOK_SECRET) {
    throw new Error("Missing required WEBHOOK_SECRET environment variable");
}

for (const plan of Plans) {
    if (!plan.priceId) {
        throw new Error(`Missing priceId for plan ${plan.id}`);
    }
}

export async function POST(req: Request) {
    try {
        const signature = (await headers()).get("x-fngs-signature");
        if (!signature) {
            return NextResponse.json({ error: "No signature provided" }, { status: 401 });
        }

        const payload = await req.text();
        if (!verifySignature(payload, signature)) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
        }

        const body: WebhookPayload = JSON.parse(payload);
        const item = body.data.items[0];
        const itemId = item?.offer?.id || item?.product?.id;

        if (!itemId) {
            return NextResponse.json({ error: "Missing required IDs in webhook data" }, { status: 400 });
        }

        const selectedPlan = Plans.find((p) => p.priceId === itemId);
        if (!selectedPlan) {
            return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
        }

        const email = body.data.customer.email;
        if (!email) {
            return NextResponse.json({ error: "Customer email is missing" }, { status: 400 });
        }

        const userId = await resolveAppwriteUser(email, body.data.customer.username);
        if (!userId) {
            return NextResponse.json({ error: "Failed to resolve Appwrite user" }, { status: 400 });
        }

        // Create or update user
        await prisma.user.upsert({
            where: { id: userId },
            create: {
                id: userId,
                email: email,
                name: body.data.customer.username,
                fungiesCustomerId: body.data.customer.id,
            },
            update: {
                fungiesCustomerId: body.data.customer.id,
            },
        });

        // Handle different webhook events
        switch (body.type) {
            case 'payment_success': {
                if (selectedPlan.billing === 'one-time') {
                    await handleOneTimePayment(userId, selectedPlan);
                } else {
                    await handleSubscriptionPayment(userId, selectedPlan);
                }
                break;
            }
            case 'subscription_created':
            case 'subscription_interval': {
                if (selectedPlan.billing === 'monthly') {
                    await handleSubscriptionPayment(userId, selectedPlan);
                }
                break;
            }
            case 'subscription_cancelled': {
                await prisma.package.update({
                    where: { userId },
                    data: {
                        status: 'CANCELLED',
                    }
                });
                break;
            }
            case 'payment_failed': {
                await prisma.package.update({
                    where: { userId },
                    data: {
                        status: 'FAILED',
                    }
                });
                break;
            }
            case 'payment_refunded': {
                await prisma.package.update({
                    where: { userId },
                    data: {
                        status: 'REFUNDED',
                    }
                });
                break;
            }
        }

        return NextResponse.json({ success: true, userId, planId: selectedPlan.id });
    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json(
            { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

async function handleOneTimePayment(userId: string, selectedPlan: Plan) {
    const existingPackage = await prisma.package.findUnique({
        where: { userId }
    });

    if (existingPackage) {
        await prisma.package.update({
            where: { userId },
            data: {
                planType: "ONCE_OFF",
                status: "ACTIVE",
                currentPeriodStart: null,
                currentPeriodEnd: null,
            },
        });
    } else {
        await prisma.package.create({
            data: {
                userId,
                planType: "ONCE_OFF",
                planId: selectedPlan.id,
                status: "ACTIVE",
                currentPeriodStart: null,
                currentPeriodEnd: null,
            },
        });
    }
}

async function handleSubscriptionPayment(userId: string, selectedPlan: Plan) {
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    await prisma.package.upsert({
        where: { userId },
        create: {
            userId,
            fungiesSubscriptionId: userId,
            planType: "SUBSCRIPTION",
            planId: selectedPlan.id,
            status: "ACTIVE",
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
        },
        update: {
            planId: selectedPlan.id,
            status: "ACTIVE",
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
        },
    });
}

async function resolveAppwriteUser(email: string, name: string): Promise<string | null> {
    try {
        client
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
            .setKey(process.env.APPWRITE_API_KEY!);

        const userList = await users.list([
            Query.equal('email', email)
        ]);
        
        if (userList.total > 0) {
            return userList.users[0].$id;
        }

        const password = ID.unique();
        const newUser = await users.create(
            ID.unique(),
            email,
            password,
            name
        );
        
        return newUser.$id;
    } catch (error) {
        console.error("Error resolving Appwrite user:", error);
        return null;
    }
}