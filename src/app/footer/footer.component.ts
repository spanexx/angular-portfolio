import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../core/services/mock-data.service';
import { ContactService } from '../core/services/contact.service';
import { PortfolioDataService } from '../core/services/portfolio-data.service';
import { ContactInfo, Profile } from '../shared/models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  contactInfo: ContactInfo | undefined;
  profile: Profile | undefined;
  currentYear = new Date().getFullYear();

  constructor(
    private mockDataService: MockDataService,
    private contactService: ContactService,
    private portfolioDataService: PortfolioDataService
  ) {}
  
  ngOnInit(): void {
    this.loadContactInfo();
    this.loadProfile();
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

  private loadProfile(): void {
    this.portfolioDataService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (error) => {
        console.warn('Failed to load profile from API, using mock data:', error);
        this.profile = this.mockDataService.getProfile();
      }
    });
  }

  getWhatsAppUrl(): string {
    if (!this.contactInfo?.phone) {
      return '#';
    }
    // Remove any non-numeric characters except + for country code
    const cleanedPhone = this.contactInfo.phone.replace(/[^\d+]/g, '');
    return `https://wa.me/${cleanedPhone}`;
  }
}
