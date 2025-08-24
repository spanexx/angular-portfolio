import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Certification } from '../shared/models';
import { MockDataService } from '../core/services/mock-data.service';
import { PortfolioDataService } from '../core/services/portfolio-data.service';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.css'
})
export class CertificationsComponent implements OnInit {
  certifications: Certification[] = [];
  
  private mockDataService = inject(MockDataService);
  private portfolioDataService = inject(PortfolioDataService);

  ngOnInit(): void {
    this.loadCertifications();
  }

  private loadCertifications(): void {
    this.portfolioDataService.getCertifications().subscribe({
      next: (certifications) => {
        this.certifications = certifications;
      },
      error: (error) => {
        console.warn('Failed to load certifications from API, using mock data:', error);
        this.certifications = this.mockDataService.getCertifications();
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).getFullYear().toString();
  }
}