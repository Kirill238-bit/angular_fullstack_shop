export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  image_url: string;
  volume_ml: number;
  category: string;
  in_stock: boolean;
  stock_quantity: number;
  created_at?: string;
}

export interface ProductFilters {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  search?: string;
  category?: string;
  inStock?: boolean;
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    brands: string[];
    categories: string[];
  };
}
