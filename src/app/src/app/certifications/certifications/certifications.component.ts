import { Component } from '@angular/core';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [], // Certifications will not use TimelineComponent directly, but will have its own structure.
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.css'
})
export class CertificationsComponent {
  certificationItems = [
    {
      title: 'Angular Certified Developer',
      organization: 'Issuing Organization',
      date: 'January 2022'
    },
    {
      title: 'Node.js Application Developer',
      organization: 'Issuing Organization',
      date: 'June 2021'
    },
    {
      title: 'Full Stack Web Development',
      organization: 'Issuing Organization',
      date: 'March 2020'
    }
  ];
}
