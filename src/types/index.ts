export interface UIVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
}

export interface UIProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  cookingTime: number;
  discountPct?: number;
  isFeatured?: boolean;
  hasVariants?: boolean;
  variants?: UIVariant[];
  contents?: string[];
  cookingSteps?: string[];
  nutrition?: { label: string; value: string }[];
}
