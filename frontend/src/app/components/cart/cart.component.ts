import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../interfaces/order.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule, LoadingSpinnerComponent, ReactiveFormsModule],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  orderForm: FormGroup;
  isAuthenticated = false;
  currentUser: any = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.orderForm = this.fb.group({
      customerPhone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9]{10,11}$/)]],
      shippingAddress: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    this.isAuthenticated = this.authService.isAuthenticated();

    // Если пользователь авторизован, заполняем форму его данными
    if (this.isAuthenticated) {
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.currentUser = user;
          this.orderForm.patchValue({
            customerPhone: user.phone || '',
            shippingAddress: user.address || ''
          });
        }
      });
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.snackBar.open('Корзина очищена');
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  getTotalItems(): number {
    return this.cartService.getTotalItems();
  }

  createOrder(): void {
    console.log('Creating order...');
    console.log('Form valid:', this.orderForm.valid);
    console.log('Form values:', this.orderForm.value);
    console.log('User:', this.currentUser);

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      alert('Пожалуйста, заполните все обязательные поля правильно');
      return;
    }

    if (!this.isAuthenticated) {
      alert('Для оформления заказа необходимо войти в систему');
      this.router.navigate(['/login']);
      return;
    }

    if (this.cartItems.length === 0) {
      alert('Корзина пуста');
      return;
    }

    // Используем имя пользователя из профиля
    const customerName = this.currentUser ?
      `${this.currentUser.first_name} ${this.currentUser.last_name}` :
      'Неизвестный пользователь';

    const orderData = {
      items: this.cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      shippingAddress: this.orderForm.value.shippingAddress,
      customerName: customerName, // Берем из профиля
      customerPhone: this.orderForm.value.customerPhone
    };

    console.log('Sending order data to server:', orderData);

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        this.cartService.clearCart();
        alert(`Заказ #${response.orderId} успешно создан!`);
        this.router.navigate(['/orders', response.orderId]);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        console.error('Error details:', error.error);

        let errorMessage = 'Ошибка при создании заказа';
        if (error.status === 401) {
          errorMessage = 'Необходимо авторизоваться';
          this.router.navigate(['/login']);
        } else if (error.status === 500) {
          errorMessage = 'Ошибка на сервере. Попробуйте позже';
        } else if (error.error?.error) {
          errorMessage = error.error.error;
        }

        alert(errorMessage);
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  get customerPhone() {
    return this.orderForm.get('customerPhone');
  }

  get shippingAddress() {
    return this.orderForm.get('shippingAddress');
  }
}
