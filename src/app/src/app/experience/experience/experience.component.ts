import { Component } from '@angular/core';
import { TimelineComponent } from '../../components/timeline/timeline/timeline.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [TimelineComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent {
  experienceItems = [
    {
      date: '2022 - Present',
      title: 'Senior Frontend Developer',
      subtitle: 'Company Name',
      description: 'Developing and maintaining Angular applications, implementing responsive designs, and collaborating with backend developers.'
    },
    {
      date: '2020 - 2022',
      title: 'Full Stack Developer',
      subtitle: 'Company Name',
      description: 'Worked on Node.js backend services and Angular frontend applications, participated in the full development lifecycle.'
    },
    {
      date: '2018 - 2020',
      title: 'Junior Web Developer',
      subtitle: 'Company Name',
      description: 'Assisted in developing web applications using JavaScript frameworks and contributed to UI/UX improvements.'
    }
  ];
}
