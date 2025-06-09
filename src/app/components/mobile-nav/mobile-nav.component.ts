import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mobile-nav-overlay" [class.active]="isOpen" (click)="closeNav()">
      <nav class="mobile-nav" [class.active]="isOpen" (click)="$event.stopPropagation()">
        <div class="mobile-nav-header">
          <h3>Navigation</h3>
          <button class="close-btn" (click)="closeNav()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="mobile-nav-content">
          <div class="nav-section">
            <h4>Portfolio</h4>
            <ul>
              <li><a routerLink="/portfolio" (click)="closeNav()">All Projects</a></li>
            </ul>
          </div>
          
          <div class="nav-section">
            <h4>Experience</h4>
            <ul>
              <li><a routerLink="/experience" (click)="closeNav()">Work History</a></li>
              <li><a routerLink="/education" (click)="closeNav()">Education</a></li>
              <li><a routerLink="/certifications" (click)="closeNav()">Certifications</a></li>
            </ul>
          </div>
          
          <div class="nav-section">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:victorchideraani@gmail.com" (click)="closeNav()">Email</a></li>
              <li><a href="https://github.com/spanexx" target="_blank" (click)="closeNav()">GitHub</a></li>
              <li><a href="https://linkedin.com/in/victorchidera" target="_blank" (click)="closeNav()">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  `,
  styles: [`    .mobile-nav-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .mobile-nav-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .mobile-nav {
      position: fixed;
      top: 0;
      right: -320px;
      width: 320px;
      height: 100%;
      background-color: white;
      box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
      transition: right 300ms cubic-bezier(0.4, 0, 0.2, 1);
      overflow-y: auto;
      z-index: 10000;
    }

    .mobile-nav.active {
      right: 0;
    }

    .mobile-nav-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      background-color: #2563eb;
      color: white;
    }

    .mobile-nav-header h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.2rem;
      padding: 0.5rem;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 200ms ease;
    }

    .close-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .mobile-nav-content {
      padding: 1.5rem;
    }

    .nav-section {
      margin-bottom: 2rem;
    }

    .nav-section h4 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }

    .nav-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-section li {
      margin-bottom: 0.5rem;
    }

    .nav-section a {
      display: block;
      padding: 0.75rem 1rem;
      color: #6b7280;
      text-decoration: none;
      border-radius: 6px;
      transition: all 200ms ease;
      font-weight: 500;
    }

    .nav-section a:hover {
      background-color: #f3f4f6;
      color: #2563eb;
      transform: translateX(4px);
    }

    @media (max-width: 480px) {
      .mobile-nav {
        width: 280px;
        right: -280px;
      }
    }
  `]
})
export class MobileNavComponent {
  @Input() isOpen = false;
  @Output() closeNavigation = new EventEmitter<void>();

  closeNav() {
    this.closeNavigation.emit();
  }
}
