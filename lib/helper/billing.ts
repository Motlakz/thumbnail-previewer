import { Plan, PlanId, Plans } from "@/types/billing";

export const getPlanById = (planId: string): Plan | undefined => Plans.find((plan) => plan.id === planId);

export const PlanFeatures: Record<PlanId, string[]> = {
    [PlanId.BASIC]: Plans.find((p) => p.id === PlanId.BASIC)!.features,
    [PlanId.PREMIUM]: Plans.find((p) => p.id === PlanId.PREMIUM)!.features,
    [PlanId.PRO]: Plans.find((p) => p.id === PlanId.PRO)!.features,
};
