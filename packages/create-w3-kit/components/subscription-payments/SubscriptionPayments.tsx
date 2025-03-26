import React, { useState } from "react";
import { CreditCard, Check, AlertCircle, Sparkles, Zap, Shield, Star } from "lucide-react";
import Image from "next/image";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  token: {
    symbol: string;
    logoURI: string;
    decimals: number;
  };
  interval: "daily" | "weekly" | "monthly" | "yearly";
  features: string[];
  description: string;
  icon: "sparkles" | "zap" | "shield";
  isPopular?: boolean;
}

interface SubscriptionPaymentsProps {
  plans: SubscriptionPlan[];
  onSubscribe?: (planId: string) => void;
  className?: string;
}

export const SubscriptionPayments: React.FC<SubscriptionPaymentsProps> = ({
  plans,
  onSubscribe,
  className = "",
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(plans[0]?.id || "");

  // Ensure activeTab is always valid
  React.useEffect(() => {
    if (plans.length > 0 && !plans.some(plan => plan.id === activeTab)) {
      setActiveTab(plans[0].id);
    }
  }, [plans, activeTab]);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    setIsSubscribing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      await onSubscribe?.(selectedPlan.id);
      
      setShowSuccess(true);
      // Keep success state visible for longer
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccess(false);
      setSelectedPlan(null);
    } finally {
      setIsSubscribing(false);
    }
  };

  const getIcon = (icon: SubscriptionPlan["icon"]) => {
    switch (icon) {
      case "sparkles":
        return <Sparkles className="w-6 h-6" />;
      case "zap":
        return <Zap className="w-6 h-6" />;
      case "shield":
        return <Shield className="w-6 h-6" />;
    }
  };

  const currentPlan = plans.find(plan => plan.id === activeTab);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 ${className}`}>
      <div className="space-y-6">
        {/* Plan Tabs */}
        <div className="flex flex-wrap w-full gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setActiveTab(plan.id)}
              className={`relative flex-1 min-w-[140px] sm:min-w-[150px] flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${
                activeTab === plan.id
                  ? plan.isPopular
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "bg-blue-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                {getIcon(plan.icon)}
                <span className="font-medium text-sm sm:text-base">{plan.name}</span>
              </div>
              {plan.isPopular && (
                <span className="absolute -top-3 -right-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center shadow-sm">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Plan Content */}
        {currentPlan && (
          <div className="space-y-6">
            {/* Plan Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                {getIcon(currentPlan.icon)}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      {currentPlan.name}
                    </h3>
                    {currentPlan.isPopular && (
                      <span className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center shadow-sm">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    {currentPlan.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Image
                  src={currentPlan.token.logoURI}
                  alt={currentPlan.token.symbol}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {currentPlan.price}
                </span>
                <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  /{currentPlan.interval}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              disabled={isSubscribing || showSuccess}
              className={`group relative w-full px-4 py-3 bg-blue-500 text-white rounded-lg transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center overflow-hidden ${
                (isSubscribing || showSuccess) ? "opacity-90 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
            >
              {/* Loading state background effect */}
              {isSubscribing && (
                <div className="absolute inset-0 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-[length:200%_100%] animate-loading-shine"
                    style={{ '--loading-shine': 'rgba(255, 255, 255, 0.1)' } as React.CSSProperties}
                  />
                </div>
              )}

              {/* Button content with animations */}
              <div className={`relative flex items-center justify-center space-x-2 transition-all duration-300 ${
                isSubscribing ? "animate-loading-pulse" : ""
              }`}>
                {isSubscribing ? (
                  <>
                    {/* Loading spinner */}
                    <div className="relative w-5 h-5">
                      <div className="absolute inset-0 border-2 border-white/30 rounded-full" />
                      <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-loading-spin" />
                    </div>
                    
                    {/* Loading text with dots */}
                    <div className="flex items-center">
                      <span className="whitespace-nowrap mr-1">Subscribing</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-loading-pulse" style={{ animationDelay: '0s' }} />
                        <div className="w-1 h-1 bg-white rounded-full animate-loading-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1 h-1 bg-white rounded-full animate-loading-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </>
                ) : showSuccess ? (
                  <div className="flex items-center animate-slide-in">
                    <Check className="w-5 h-5 mr-2 animate-bounce" />
                    <span className="whitespace-nowrap">Subscribed!</span>
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 transition-transform duration-200 group-hover:rotate-3" />
                    <span className="whitespace-nowrap">Subscribe Now</span>
                  </>
                )}
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 w-full h-full transition-opacity group-hover:opacity-100 opacity-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-loading-shine" />
              </div>
            </button>

            {/* Warning Message */}
            <div className="flex flex-wrap items-center text-sm text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Subscriptions will automatically renew unless cancelled</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 