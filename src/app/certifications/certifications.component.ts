import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Certification } from '../shared/models';
import { MockDataService } from '../core/services/mock-data.service';

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

  ngOnInit(): void {
    this.certifications = this.mockDataService.getCertifications();
  }

  formatDate(date: string): string {
    return new Date(date).getFullYear().toString();
  }
}