import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, FormsModule],
})
export class App {
  title = 'Магазин духов';

  private authService = inject(AuthService);
  private cartService = inject(CartService);

  currentUser = toSignal(this.authService.currentUser$);
  cartItemsCount = toSignal(this.cartService.cartItems$.pipe(
    map(() => this.cartService.getTotalItems())
  ));

  getUserName(): string {
    const user = this.currentUser();
    if (!user) return 'Пользователь';

    return (user as any).firstName || 'Пользователь';
  }

  logout(): void {
    this.authService.logout();
  }
}
