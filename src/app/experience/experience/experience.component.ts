import { Component, OnInit, inject } from '@angular/core';
import { TimelineComponent } from '../../components/timeline/timeline/timeline.component';
import { Experience } from '../../shared/models';
import { MockDataService } from '../../core/services/mock-data.service';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [TimelineComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent implements OnInit {
  experiences: Experience[] = [];
  experienceItems: any[] = [];
  
  private mockDataService = inject(MockDataService);
  private portfolioDataService = inject(PortfolioDataService);

  ngOnInit(): void {
    this.loadExperience();
  }

  private loadExperience(): void {
    this.portfolioDataService.getExperience().subscribe({
      next: (experiences) => {
        this.experiences = experiences;
        this.experienceItems = this.transformExperiencesToTimelineItems();
      },
      error: (error) => {
        console.warn('Failed to load experience from API, using mock data:', error);
        this.experiences = this.mockDataService.getExperiences();
        this.experienceItems = this.transformExperiencesToTimelineItems();
      }
    });
  }

  private transformExperiencesToTimelineItems(): any[] {
    return this.experiences.map(experience => ({
      date: this.formatDateRange(experience.startDate, experience.endDate),
      title: experience.role,
      subtitle: experience.company,
      description: this.formatResponsibilities(experience.responsibilities)
    }));
  }

  private formatDateRange(startDate: string, endDate: string | undefined): string {
    const formatYear = (date: string) => {
      return new Date(date).getFullYear().toString();
    };

    const start = formatYear(startDate);
    const end = endDate ? formatYear(endDate) : 'Present';
    
    return start === end ? start : `${start} - ${end}`;
  }

  private formatResponsibilities(responsibilities: string[]): string {
    return responsibilities.slice(0, 3).join('. ') + (responsibilities.length > 3 ? '...' : '.');
  }
}
