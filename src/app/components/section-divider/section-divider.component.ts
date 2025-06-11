import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-divider" [class]="themeClass">
      <div class="divider-line"></div>
      <div class="divider-icon" *ngIf="icon">
        <i [class]="icon"></i>
      </div>
      <div class="divider-text" *ngIf="text">{{ text }}</div>
    </div><br><br>
  `,
  styles: [`
    .section-divider {
      position: relative;
      padding: 3rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .divider-line {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, #dee2e6 20%, #adb5bd 50%, #dee2e6 80%, transparent 100%);
      transform: translateY(-50%);
    }

    .divider-icon {
      background: #ffffff;
      border: 2px solid #dee2e6;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: #6c757d;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 2;
    }

    .divider-text {
      background: #ffffff;
      padding: 0.5rem 1.5rem;
      border: 2px solid #dee2e6;
      border-radius: 25px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #495057;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 2;
    }

    .section-divider.education {
      background: linear-gradient(90deg, transparent 0%, rgba(40, 167, 69, 0.05) 50%, transparent 100%);
    }

    .section-divider.education .divider-icon {
      border-color: #28a745;
      color: #28a745;
    }

    .section-divider.education .divider-text {
      border-color: #28a745;
      color: #28a745;
    }

    .section-divider.experience {
      background: linear-gradient(90deg, transparent 0%, rgba(255, 111, 0, 0.05) 50%, transparent 100%);
    }

    .section-divider.experience .divider-icon {
      border-color: #ff6f00;
      color: #ff6f00;
    }

    .section-divider.experience .divider-text {
      border-color: #ff6f00;
      color: #ff6f00;
    }
  `]
})
export class SectionDividerComponent {
  @Input() icon?: string;
  @Input() text?: string;
  @Input() theme: 'education' | 'experience' | 'default' = 'default';

  get themeClass(): string {
    return this.theme;
  }
}
