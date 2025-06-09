import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'portfolio',
    loadChildren: () => import('../portfolio/portfolio.routes').then(m => m.PORTFOLIO_ROUTES)
  },
  { path: '', redirectTo: '/portfolio', pathMatch: 'full' },
  { path: "education", loadComponent: () => import('./education/education/education.component').then(m => m.EducationComponent) },
  {path: "experience", loadComponent: () => import('./experience/experience/experience.component').then(m => m.ExperienceComponent) },
  {path: "certifications", loadComponent: () => import('./certifications/certifications.component').then(m => m.CertificationsComponent) },
  { path: '**', redirectTo: '/portfolio' } // Wildcard route for any unmatched paths
];
