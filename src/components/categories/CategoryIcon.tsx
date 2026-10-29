import * as React from "react";
import {
  Bot,
  Sparkles,
  FileText,
  Code,
  Layers,
  Megaphone,
  Search,
  Share2,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Coins,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Palette,
  Building,
  Home,
  Compass,
  Globe,
  Tag,
  LucideIcon,
} from "lucide-react";

interface CategoryIconProps {
  name?: string;
  slug?: string;
  className?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  // By icon_name
  Bot,
  Sparkles,
  FileText,
  Code,
  Layers,
  Megaphone,
  Search,
  Share2,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Coins,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Palette,
  Building,
  Home,
  Compass,
  Globe,
  Tag,

  // By slug
  "ai-agents": Bot,
  "ai-image-video": Sparkles,
  "ai-writing": FileText,
  "developer-tools": Code,
  "saas-productivity": Layers,
  "marketing-ads": Megaphone,
  "seo-visibility": Search,
  "social-creator": Share2,
  "sales-leads": TrendingUp,
  "ecommerce-retail": ShoppingBag,
  "fintech-payments": CreditCard,
  "crypto-web3": Coins,
  "education-learning": GraduationCap,
  "health-fitness": HeartPulse,
  "hiring-jobs": Briefcase,
  "design-creative": Palette,
  "agencies-services": Building,
  "real-estate": Home,
  "travel-local": Compass,
  other: Globe,
};

export function CategoryIcon({ name, slug, className = "w-4 h-4" }: CategoryIconProps) {
  let IconComponent = Tag;

  if (name && ICON_MAP[name]) {
    IconComponent = ICON_MAP[name];
  } else if (slug && ICON_MAP[slug]) {
    IconComponent = ICON_MAP[slug];
  }

  return <IconComponent className={className} />;
}

