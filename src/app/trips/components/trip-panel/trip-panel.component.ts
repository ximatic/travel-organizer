import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

import { CardModule } from 'primeng/card';

import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-panel',
  templateUrl: './trip-panel.component.html',
  styleUrl: './trip-panel.component.scss',
  standalone: true,
  imports: [CommonModule, CardModule],
})
export class TripPanelComponent {
  @Input() trip!: Trip;

  @ContentChild('headerIcon') headerIcon?: TemplateRef<Element>;
}
