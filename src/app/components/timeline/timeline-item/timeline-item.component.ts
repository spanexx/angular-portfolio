import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-timeline-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timeline-item.component.html',
  styleUrl: './timeline-item.component.css'
})
export class TimelineItemComponent {
  @Input() date: string = '';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() description: string = '';
}
