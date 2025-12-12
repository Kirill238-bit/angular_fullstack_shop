import { Product } from "./product.interface";

export interface OrderItem {
  id?: number;
  product_id: number;
  quantity: number;
  price: number;
  name?: string;
  brand?: string;
  image_url?: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address: string;
  customer_name: string; // Изменили с customerName на customer_name
  customer_phone: string; // Изменили с customerPhone на customer_phone
  created_at: string;
  items_count?: number;
  items?: OrderItem[];
}

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: string;
  customerName: string;
  customerPhone: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
