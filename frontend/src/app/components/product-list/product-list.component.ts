import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, ProductFilters } from '../../interfaces/product.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule, LoadingSpinnerComponent],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  brands: string[] = [];
  categories: string[] = [];

  filters: ProductFilters = {
    page: 1,
    limit: 12,
    sortBy: '',
    search: '',
    brand: '',
    category: '',
    inStock: false
  };

  pagination = {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false
  };

  loading = false;
  priceRange = { min: 0, max: 20000 };

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadFilters();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.filters).subscribe({
      next: (response) => {
        this.products = response.products;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
        this.snackBar.open('Ошибка загрузки товаров', 'Закрыть', { duration: 3000 });
      }
    });
  }

  loadFilters(): void {
    this.productService.getBrands().subscribe(brands => {
      this.brands = brands;
    });

    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.loadProducts();
  }

  clearFilters(): void {
    this.filters = {
      page: 1,
      limit: 12,
      sortBy: '',
      search: '',
      brand: '',
      category: '',
      inStock: false
    };
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.filters.page = page;
    this.loadProducts();
    window.scrollTo(0, 0);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.snackBar.open(`${product.name} добавлен в корзину`, 'Закрыть', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
