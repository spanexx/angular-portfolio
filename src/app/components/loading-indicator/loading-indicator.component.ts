import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loadingService.loading$ | async) {
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    }
  `,
  styleUrl: './loading-indicator.component.css'
})
export class LoadingIndicatorComponent {
  constructor(public loadingService: LoadingService) {}
}