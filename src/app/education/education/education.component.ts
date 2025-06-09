import { Component, OnInit, inject } from '@angular/core';
import { TimelineComponent } from '../../components/timeline/timeline/timeline.component';
import { Education } from '../../shared/models';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [TimelineComponent],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationComponent implements OnInit {
  educations: Education[] = [];
  educationItems: any[] = [];
  
  private mockDataService = inject(MockDataService);

  ngOnInit(): void {
    this.educations = this.mockDataService.getEducations();
    this.educationItems = this.transformEducationsToTimelineItems();
  }

  private transformEducationsToTimelineItems(): any[] {
    return this.educations.map(education => ({
      date: this.formatDateRange(education.startDate, education.endDate),
      title: `${education.degree} in ${education.fieldOfStudy}`,
      subtitle: education.institution,
      description: education.description || `${education.degree} program at ${education.institution}`
    }));
  }

  private formatDateRange(startDate: string, endDate: string | 'Present'): string {
    const formatYear = (date: string) => {
      if (date === 'Present') return 'Present';
      return new Date(date).getFullYear().toString();
    };

    const start = formatYear(startDate);
    const end = formatYear(endDate);
    
    return start === end ? start : `${start} - ${end}`;
  }
}
