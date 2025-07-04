import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../core/services/mock-data.service';
import { ContactInfo, Profile } from '../shared/models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  contactInfo!: ContactInfo;
  profile!: Profile;
  currentYear = new Date().getFullYear();

  constructor(private mockDataService: MockDataService) {}
  ngOnInit(): void {
    this.contactInfo = this.mockDataService.getContactInfo();
    this.profile = this.mockDataService.getProfile();
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
