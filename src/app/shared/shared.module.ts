import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


import { AppShellComponent } from '../app-shell/app-shell.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';


@NgModule({
  declarations: [
    // AppShellComponent,
    // HeaderComponent,
    // SidebarComponent,
    // FooterComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    // AppShellComponent,
    // HeaderComponent,
    // SidebarComponent,
    // FooterComponent
  ]
})
export class SharedModule { }
