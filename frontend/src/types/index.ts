export interface UseCase { title: string; description: string; icon: string; }
export interface Facility { title: string; description: string; icon: string; }
export interface PricingPlan { title: string; price: string; period: string; features: string[]; isPopular?: boolean; }
export interface FaqItem { question: string; answer: string; }
