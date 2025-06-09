import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineItemComponent } from '../timeline-item/timeline-item.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TimelineItemComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent {
  @Input() items: any[] = [];
}
