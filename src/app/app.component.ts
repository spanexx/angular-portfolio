import { Component } from '@angular/core';
import { AppShellComponent } from './app-shell/app-shell.component';
import { WhatsappFloatComponent } from './components/whatsapp-float/whatsapp-float.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent, WhatsappFloatComponent],
  templateUrl: './app.component.html',
  styleUrls:[ './app.component.scss' ]
})
export class AppComponent {
  title = 'angular-portfolio';
}
