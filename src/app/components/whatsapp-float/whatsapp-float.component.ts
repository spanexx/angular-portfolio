import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { ContactService } from '../../core/services/contact.service';
import { ContactInfo } from '../../shared/models';

@Component({
  selector: 'app-whatsapp-float',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-float.component.html',
  styleUrl: './whatsapp-float.component.css'
})
export class WhatsappFloatComponent implements OnInit {
  contactInfo: ContactInfo | undefined;
  isVisible = true;
  isHovered = false;

  constructor(
    private mockDataService: MockDataService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.loadContactInfo();
  }

  private loadContactInfo(): void {
    this.contactService.getContactInfo().subscribe({
      next: (contact) => {
        this.contactInfo = contact;
      },
      error: (error) => {
        console.warn('Failed to load contact info from API, using mock data:', error);
        this.contactInfo = this.mockDataService.getContactInfo();
      }
    });
  }

  getWhatsAppUrl(): string {
    if (!this.contactInfo?.phone) {
      return '#';
    }
    // Remove any non-numeric characters except + for country code
    const cleanedPhone = this.contactInfo.phone.replace(/[^\d+]/g, '');
    const message = encodeURIComponent('Hello! I found your portfolio and would like to get in touch.');
    return `https://wa.me/${cleanedPhone}?text=${message}`;
  }
  openWhatsApp(event?: Event): void {
    // Prevent event bubbling and default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
    
    const url = this.getWhatsAppUrl();
    if (url !== '#') {
      // Use setTimeout to prevent any animation conflicts
      setTimeout(() => {
        window.open(url, '_blank');
      }, 0);
    }
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }

  hide(): void {
    this.isVisible = false;
  }
}
