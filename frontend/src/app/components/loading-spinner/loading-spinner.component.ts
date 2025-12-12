import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  imports: [CommonModule],
})
export class LoadingSpinnerComponent {
  @Input() diameter = 50;
  @Input() color = 'primary';
  @Input() message = '';
}
