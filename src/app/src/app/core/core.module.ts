import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../../../core/services/portfolio-data.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [PortfolioDataService]
})
export class CoreModule { }
