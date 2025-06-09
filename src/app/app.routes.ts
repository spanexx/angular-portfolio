import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'portfolio',
    loadChildren: () => import('./portfolio/portfolio.routes').then(m => m.PORTFOLIO_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'education',
    loadChildren: () => import('./education/education.routes').then(m => m.EDUCATION_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'experience',
    loadChildren: () => import('./experience/experience.routes').then(m => m.EXPERIENCE_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'certifications',
    loadChildren: () => import('./certifications/certifications.routes').then(m => m.CERTIFICATIONS_ROUTES),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/portfolio', pathMatch: 'full' },
  { path: '**', redirectTo: '/portfolio' } // Wildcard route for any unmatched paths
];
