import { Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio.component';
import { ProjectDetailComponent } from '../app/portfolio/project-detail/project-detail.component';

export const PORTFOLIO_ROUTES: Routes = [
  { path: '', component: PortfolioComponent },
  { path: 'project/:id', component: ProjectDetailComponent }
];