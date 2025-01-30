import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PanelModule } from 'primeng/panel';

import { Trip } from '../../models/trip.model';

import { UserSettings } from '../../../user/models/user-settings.model';
import { selectUserSettings } from '../../../user/store/user.selectors';
import { UserState } from '../../../user/store/user.state';
import { DEFAULT_USER_SETTINGS } from '../../../user/constants/settings.constants';

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
  userSettings$!: Observable<UserSettings | null>;

  // data
  userSettings?: UserSettings;

  // other
  private subscription = new Subscription();

  constructor(private store: Store<UserState>) {}

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
    this.userSettings$ = this.store.select(selectUserSettings);
    this.subscription.add(
      this.userSettings$.subscribe((userSettings: UserSettings | null) => {
        this.userSettings = { ...(userSettings || DEFAULT_USER_SETTINGS) };
      }),
    );
  }
}
