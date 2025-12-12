import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product} from '../interfaces/product.interface';
import { CartItem } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();


  constructor() {
    this.loadCartFromStorage();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.updateCart(currentItems);
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value.filter(item => item.product.id !== productId);
    this.updateCart(currentItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItemsSubject.value.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    this.updateCart(currentItems);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((total, item) =>
      total + (item.product.price * item.quantity), 0
    );
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    localStorage.setItem('cart', JSON.stringify(items));
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        this.cartItemsSubject.next(cartItems);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        localStorage.removeItem('cart');
      }
    }
  }
}
