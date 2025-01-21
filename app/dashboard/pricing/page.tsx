"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Star, Layout, FileImage, FileText } from "lucide-react";
import { Plans, PlanId, Plan } from "@/types/billing";

const isSubscribed = true

const PricingPage = () => {

    // Define gradient styles for each plan
    const getPlanStyle = (planId: PlanId) => {
        switch (planId) {
            case PlanId.BASIC:
                return {
                    gradient: "from-pink-400 to-pink-500",
                    darkGradient: "dark:from-cyan-500 dark:to-cyan-600",
                    isPopular: false
                };
            case PlanId.PREMIUM:
                return {
                    gradient: "from-pink-500 to-pink-600",
                    darkGradient: "dark:from-cyan-400 dark:to-cyan-500",
                    isPopular: false
                };
            case PlanId.PRO:
                return {
                    gradient: "from-pink-600 to-pink-700",
                    darkGradient: "dark:from-cyan-300 dark:to-cyan-400",
                    isPopular: true
                };
        }
    };

    const formatPriceWithPeriod = (plan: Plan) => {
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(plan.price / 100);

        return (
            <div className="mb-6">
                <sub className="text-4xl font-bold text-gray-900 dark:text-white">
                    {formattedPrice}
                </sub>
                <sup className="text-gray-600 dark:text-gray-300">
                    {plan.billing === 'monthly' ? '/month' : ' one-time'}
                </sup>
            </div>
        );
    };

    return (
        <div className="min-h-screen pt-24 bg-gradient-to-br from-pink-50 via-pink-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black">
            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-pink-600 dark:from-cyan-400 dark:to-cyan-500 bg-clip-text text-transparent">
                        Choose your preview experience
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Professional thumbnail preview tools for every platform
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
                    {Plans.map((plan, index) => {
                        const style = getPlanStyle(plan.id);
                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="relative"
                            >
                                {style.isPopular && (
                                    <div className="absolute z-10 -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-pink-500 to-pink-600 dark:from-cyan-400 dark:to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                            <Star className="w-4 h-4" /> Most Popular
                                        </span>
                                    </div>
                                )}
                                
                                <div className={`flex flex-col h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl ${style.isPopular ? 'border-2 border-pink-500 dark:border-cyan-400' : 'border border-gray-200 dark:border-gray-700'}`}>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-pink-600 dark:from-cyan-400 dark:to-cyan-500 bg-clip-text text-transparent">
                                            {plan.name}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.label}</p>
                                        
                                        <div className="my-8">
                                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                {formatPriceWithPeriod(plan)}
                                            </span>
                                        </div>

                                        <ul className="space-y-4 mb-8">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                                    <Check className="w-5 h-5 text-pink-500 dark:text-cyan-400 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-auto">
                                        <Button 
                                            className={`w-full bg-gradient-to-r ${style.gradient} ${style.darkGradient} text-white hover:opacity-90 transition-opacity`}
                                        >
                                            {isSubscribed ? "Manage Package" : "Get Started"}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Additional Features section remains the same */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <div className="bg-white dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4 text-pink-900 dark:text-cyan-50">
                            All Plans Include
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4">
                                <FileImage className="w-6 h-6 mx-auto mb-2 text-pink-500 dark:text-cyan-400" />
                                <p className="text-gray-700 dark:text-gray-300">Multi-Format Support</p>
                            </div>
                            <div className="p-4">
                                <Layout className="w-6 h-6 mx-auto mb-2 text-pink-500 dark:text-cyan-400" />
                                <p className="text-gray-700 dark:text-gray-300">Responsive Preview</p>
                            </div>
                            <div className="p-4">
                                <FileText className="w-6 h-6 mx-auto mb-2 text-pink-500 dark:text-cyan-400" />
                                <p className="text-gray-700 dark:text-gray-300">24/7 Support</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PricingPage;