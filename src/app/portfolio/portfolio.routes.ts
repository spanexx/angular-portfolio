import { Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio.component';

export const PORTFOLIO_ROUTES: Routes = [
  { path: '', component: PortfolioComponent },
  { path: 'project/:title', component: PortfolioComponent } // TODO: Replace with ProjectDetailComponent
];