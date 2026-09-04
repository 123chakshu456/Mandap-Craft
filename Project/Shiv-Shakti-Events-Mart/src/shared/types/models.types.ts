// =========================================================
// Domain Model Types for Shiv Shakti Events Mart Platform
// =========================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

export interface CategoryPromo {
  title: string;
  subtitle: string;
  badge: string;
  discount?: string;
  image: string;
  ctaText: string;
  targetSubcategory?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  shortTitle?: string;
  tagline?: string;
  description?: string;
  image?: string;
  icon?: string;
  badge?: string;
  promo?: CategoryPromo;
  popularItems?: string[];
  parentId?: string | null;
  level: number;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
  children?: Category[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  publicId?: string | null;
  altText?: string | null;
  sortOrder: number;
  type: string;
  isPrimary: boolean;
}

export interface ProductBadge {
  id: string;
  productId: string;
  badgeId: string;
  badge: Badge;
}

export interface ProductFilterValue {
  id: string;
  productId: string;
  filterValueId: string;
  filterValue: FilterValue;
}

export interface Product {
  id: string;
  sku?: string;
  name: string;
  slug?: string;
  categoryId?: string | null;
  subcategoryId?: string | null;
  subSubcategoryId?: string | null;
  style: string;
  price: number;
  compareAtPrice?: number | null;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  features: string[];
  isFeatured: boolean;
  tag?: string | null;
  inStock: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';
  sortPriority: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  publishedAt?: string | null;
  unpublishedAt?: string | null;
  images?: ProductImage[];
  badges?: ProductBadge[];
  filterValues?: ProductFilterValue[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterValue {
  id: string;
  filterId: string;
  value: string;
  label: string;
  sortOrder: number;
  filter?: Filter;
}

export interface Filter {
  id: string;
  name: string;
  label: string;
  key: string;
  type: 'select' | 'multi-select' | 'range';
  sortOrder: number;
  isActive: boolean;
  applicableCategories: string[];
  values: FilterValue[];
}

export interface Badge {
  id: string;
  name: string;
  slug: string;
  label: string;
  color?: string;
  bgColor?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';
  content: string;
  heroImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: string | null;
  unpublishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  itemType: string;
  image?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  discountAmount: number;
  grandTotal: number;
  paymentMethod: string;
  status: 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  user?: { id: string; name: string; email: string } | null;
  createdAt: string;
}

export interface Quote {
  id: string;
  email: string;
  scale: string;
  venue: string;
  drapes: string;
  estimated: number;
  status: 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED';
  user?: { id: string; name: string; email: string } | null;
  createdAt: string;
}

export interface AdminStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  totalOrders: number;
  totalQuotes: number;
  pendingQuotes: number;
  totalUsers: number;
  totalCategories: number;
  totalRevenue: number;
}
