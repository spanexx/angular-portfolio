import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'portfolio',
    loadChildren: () => import('../portfolio/portfolio.routes').then(m => m.PORTFOLIO_ROUTES)
  },
  { path: '', redirectTo: '/portfolio', pathMatch: 'full' },
  { path: '**', redirectTo: '/portfolio' } // Wildcard route for any unmatched paths
];
