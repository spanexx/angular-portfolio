import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { MobileNavComponent } from '../components/mobile-nav/mobile-nav.component';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    MobileNavComponent,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css'
})
export class AppShellComponent {
  isMobileNavOpen = false;

  openMobileNav() {
    this.isMobileNavOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeMobileNav() {
    this.isMobileNavOpen = false;
    document.body.style.overflow = '';
  }
}
