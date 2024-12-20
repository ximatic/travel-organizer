import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PanelModule } from 'primeng/panel';

import { Trip } from '../../models/trip.model';

import { Settings } from '../../../settings/models/settings.model';
import { selectSettings } from '../../../settings/store/settings.selectors';
import { SettingsState } from '../../../settings/store/settings.state';

@Component({
  selector: 'app-trip-panel',
  templateUrl: './trip-panel.component.html',
  styleUrl: './trip-panel.component.scss',
  standalone: true,
  imports: [CommonModule, PanelModule],
})
export class TripPanelComponent implements OnInit, OnDestroy {
  @Input() trip!: Trip;

  // ngrx
  settings$!: Observable<Settings>;

  // data
  settings?: Settings;

  // other
  private subscription = new Subscription();

  constructor(private store: Store<SettingsState>) {}

  // lifecycle methods

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // initialization

  private init(): void {
    this.initState();
  }

  private initState(): void {
    this.settings$ = this.store.select(selectSettings);
    this.subscription.add(
      this.settings$.subscribe((settings: Settings) => {
        this.settings = { ...settings };
      }),
    );
  }
}
