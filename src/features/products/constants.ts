import {
  Plane,
  Leaf,
  Building2,
  Shapes,
  Type,
  Snowflake,
  PawPrint,
  Stamp,
  type LucideIcon,
} from "lucide-react";
import type { ProductCategory } from "@/db/schema";

export type CategoryMeta = {
  value: ProductCategory;
  label: string;
  tagline: string;
  icon: LucideIcon;
};

/** Display metadata for every artwork category, in nav/filter order. */
export const CATEGORY_META: Record<ProductCategory, CategoryMeta> = {
  travel: {
    value: "travel",
    label: "Travel",
    tagline: "Far-flung places, drawn from the road.",
    icon: Plane,
  },
  nature: {
    value: "nature",
    label: "Nature",
    tagline: "Mountains, meadows, and quiet weather.",
    icon: Leaf,
  },
  city: {
    value: "city",
    label: "City",
    tagline: "Streets, signage, and late-night light.",
    icon: Building2,
  },
  abstract: {
    value: "abstract",
    label: "Abstract",
    tagline: "Colour and shape, untethered.",
    icon: Shapes,
  },
  typography: {
    value: "typography",
    label: "Typography",
    tagline: "Hand-lettered words worth sending.",
    icon: Type,
  },
  seasonal: {
    value: "seasonal",
    label: "Seasonal",
    tagline: "For the turning of the year.",
    icon: Snowflake,
  },
  animals: {
    value: "animals",
    label: "Animals",
    tagline: "Creatures great, small, and curious.",
    icon: PawPrint,
  },
  vintage: {
    value: "vintage",
    label: "Vintage",
    tagline: "An ode to the airmail era.",
    icon: Stamp,
  },
};

export const CATEGORY_ORDER = Object.keys(CATEGORY_META) as ProductCategory[];

export type ProductSort = "featured" | "newest" | "price_asc" | "price_desc";

export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export function isCategory(v: string | undefined): v is ProductCategory {
  return v != null && v in CATEGORY_META;
}

export function isSort(v: string | undefined): v is ProductSort {
  return v === "featured" || v === "newest" || v === "price_asc" || v === "price_desc";
}
