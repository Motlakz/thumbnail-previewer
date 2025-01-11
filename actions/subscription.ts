'use server'

import prisma from '@/lib/db';
import { PlanId } from '@/types/billing';
import { PlanType } from '@prisma/client';

export async function getSubscriptionStatus(userId: string) {
    if (!userId) return null;

    try {
        const subscription = await prisma.package.findUnique({
            where: {
                userId: userId
            },
            select: {
                status: true,
                planId: true,
                planType: true,
                currentPeriodEnd: true,
                user: { 
                    select: { 
                        fungiesCustomerId: true 
                    } 
                }
            }
        });

        return subscription;
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return null;
    }
}

export async function PurchaseSubscription(userId: string, planId: PlanId, fungiesSubscriptionId?: string) {
    if (!userId) throw new Error('User ID is required');

    try {
        // Determine plan type based on planId
        const planType = planId === PlanId.PRO ? PlanType.SUBSCRIPTION : PlanType.ONCE_OFF;

        // Calculate period dates for subscription plans
        const now = new Date();
        const periodEnd = planType === PlanType.SUBSCRIPTION 
            ? new Date(now.setMonth(now.getMonth() + 1)) 
            : null;

        // Check for existing subscription
        const existingPackage = await prisma.package.findUnique({
            where: { userId }
        });

        if (existingPackage) {
            // Update existing subscription
            return await prisma.package.update({
                where: { userId },
                data: {
                    status: 'active',
                    planType,
                    planId,
                    fungiesSubscriptionId: fungiesSubscriptionId || null,
                    currentPeriodStart: planType === PlanType.SUBSCRIPTION ? new Date() : null,
                    currentPeriodEnd: periodEnd,
                }
            });
        }

        // Create new subscription
        return await prisma.package.create({
            data: {
                status: 'active',
                planType,
                planId,
                fungiesSubscriptionId: fungiesSubscriptionId || null,
                currentPeriodStart: planType === PlanType.SUBSCRIPTION ? new Date() : null,
                currentPeriodEnd: periodEnd,
                userId
            }
        });
    } catch (error) {
        console.error('Error purchasing subscription:', error);
        throw new Error('Failed to purchase subscription');
    }
}
