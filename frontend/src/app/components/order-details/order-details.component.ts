import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order.interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-order-details',
  standalone: true,
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  loading = false;
  private datePipe = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const orderId = +params['id'];
      this.loadOrderDetails(orderId);
    });
  }

  loadOrderDetails(orderId: number): void {
    this.loading = true;
    this.orderService.getOrderDetails(orderId).subscribe({
      next: (order) => {
        console.log('Order details loaded:', order);
        this.order = order;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order details:', error);
        console.error('Error details:', error.error);
        this.loading = false;
        alert('Ошибка загрузки деталей заказа: ' + (error.error?.error || error.message));
      }
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Ожидание',
      'processing': 'В обработке',
      'completed': 'Завершен',
      'cancelled': 'Отменен'
    };
    return statusMap[status] || status;
  }

  formatDate(dateString: string): string {
    return this.datePipe = new Date(dateString).toLocaleString('ru') || 'Неизвестная дата';
  }

  calculateItemsTotal(): number {
    if (!this.order?.items) return 0;
    return this.order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}
