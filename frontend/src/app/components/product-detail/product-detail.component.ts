import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule, LoadingSpinnerComponent],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  selectedQuantity = 1;
  relatedProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loadRelatedProducts(product.brand, product.id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
        this.snackBar.open('Товар не найден', 'Закрыть', { duration: 3000 });
        this.router.navigate(['/']);
      }
    });
  }

  loadRelatedProducts(brand: string, excludeId: number): void {
    this.productService.getProducts({
      brand: brand,
      limit: 4
    }).subscribe(response => {
      this.relatedProducts = response.products
        .filter(p => p.id !== excludeId)
        .slice(0, 3);
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.selectedQuantity);
      this.snackBar.open(
        `${this.product.name} добавлен в корзину`,
        'Закрыть',
        { duration: 3000 }
      );
    }
  }

  increaseQuantity(): void {
    if (this.product && this.selectedQuantity < this.product.stock_quantity) {
      this.selectedQuantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
