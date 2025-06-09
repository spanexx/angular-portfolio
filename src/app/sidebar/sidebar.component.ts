import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileSectionComponent } from './profile-section/profile-section.component';
import { ContactSectionComponent } from './contact-section/contact-section.component';
import { CvNavigationComponent } from './cv-navigation/cv-navigation.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    ProfileSectionComponent,
    ContactSectionComponent,
    CvNavigationComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
