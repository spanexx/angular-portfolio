import { Component } from '@angular/core';
import { TimelineComponent } from '../../components/timeline/timeline/timeline.component';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [TimelineComponent],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationComponent {
  educationItems = [
    {
      date: '2018 - 2022',
      title: 'Bachelor of Science in Computer Science',
      subtitle: 'University Name',
      description: 'Relevant coursework: Web Development, Database Systems, Software Engineering'
    },
    {
      date: '2016 - 2018',
      title: 'Associate Degree in Information Technology',
      subtitle: 'College Name',
      description: 'Focus on programming fundamentals and web technologies'
    }
  ];
}
