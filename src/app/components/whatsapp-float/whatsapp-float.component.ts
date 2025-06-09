import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { ContactInfo } from '../../shared/models';

@Component({
  selector: 'app-whatsapp-float',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-float.component.html',
  styleUrl: './whatsapp-float.component.css'
})
export class WhatsappFloatComponent implements OnInit {
  contactInfo!: ContactInfo;
  isVisible = true;
  isHovered = false;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.contactInfo = this.mockDataService.getContactInfo();
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

  openWhatsApp(): void {
    const url = this.getWhatsAppUrl();
    if (url !== '#') {
      window.open(url, '_blank');
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
