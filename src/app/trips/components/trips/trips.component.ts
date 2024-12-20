import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { filter, Observable, skip, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

import { Trip } from '../../models/trip.model';
import { tripActions } from '../../store/trips.actions';
import { selectActionState, selectTrips } from '../../store/trips.selectors';
import { ActionName, ActionState, TripsActionState, TripsState } from '../../store/trips.state';

import { Settings } from '../../../settings/models/settings.model';
import { selectSettings } from '../../../settings/store/settings.selectors';
import { SettingsState } from '../../../settings/store/settings.state';

import { TripPanelComponent } from '../trip-panel/trip-panel.component';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    PanelModule,
    ProgressSpinnerModule,
    ToastModule,
    TripPanelComponent,
  ],
  providers: [MessageService],
})
export class TripsComponent implements OnInit, AfterViewInit, OnDestroy {
  // ngrx
  trips$!: Observable<Trip[]>;
  actionState$!: Observable<TripsActionState | undefined>;
  settings$!: Observable<Settings>;

  // data
  trips: Trip[] = [];
  settings?: Settings;
  isLoading = true;
  loadingError?: string;

  // other
  private subscription = new Subscription();

  constructor(
    private router: Router,
    private messageService: MessageService,
    private storeTrips: Store<TripsState>,
    private storeSettings: Store<SettingsState>,
  ) {}

  // lifecycle methods

  ngOnInit(): void {
    this.init();
  }
  ngAfterViewInit(): void {
    this.initState();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // trip handling

  openTrip(trip: Trip): void {
    this.router.navigate([`/trips/${trip.id}`]);
  }

  removeTrip(event: Event, trip: Trip): void {
    event.stopPropagation();
    this.storeTrips.dispatch(tripActions.removeTrip({ trip }));
  }

  // initialization

  private init(): void {
    this.loadTrips();
  }

  private initState(): void {
    this.trips$ = this.storeTrips.select(selectTrips);
    this.subscription.add(
      this.trips$.pipe(skip(1)).subscribe((trips: Trip[]) => {
        this.trips = trips;
        this.isLoading = false;
      }),
    );

    this.actionState$ = this.storeTrips.select(selectActionState);
    this.subscription.add(
      this.actionState$
        .pipe(
          skip(1),
          filter((actionState: TripsActionState | undefined) => this.filterActionState(actionState)),
        )
        .subscribe((actionState: TripsActionState | undefined) => this.handleActionState(actionState)),
    );

    // settings

    this.settings$ = this.storeSettings.select(selectSettings);
    this.subscription.add(
      this.settings$.subscribe((settings: Settings) => {
        this.settings = { ...settings };
      }),
    );
  }

  private filterActionState(actionState: TripsActionState | undefined): boolean {
    return actionState?.name === ActionName.RemoveTrip || actionState?.name === ActionName.LoadTrips;
  }

  private handleActionState(actionState: TripsActionState | undefined): void {
    if (!actionState) {
      return;
    }

    switch (actionState?.name) {
      case ActionName.LoadTrips:
        this.handleLoadTrips(actionState);
        break;
      case ActionName.RemoveTrip:
        this.handleRemoveTrip(actionState);
        break;
    }
  }

  private handleLoadTrips(actionState: TripsActionState): void {
    switch (actionState.state) {
      case ActionState.Loading:
        this.isLoading = true;
        break;
      case ActionState.Success:
        this.isLoading = false;
        break;
      case ActionState.Error:
        this.isLoading = false;
        this.showToast('error', 'Error', actionState?.message);
        break;
    }
  }

  private handleRemoveTrip(actionState: TripsActionState): void {
    switch (actionState.state) {
      case ActionState.Success:
        this.showToast('success', 'Success', actionState?.message);
        break;
      case ActionState.Error:
        this.showToast('error', 'Error', actionState?.message);
        break;
    }
  }

  // trips

  private loadTrips(): void {
    this.storeTrips.dispatch(tripActions.loadTrips());
  }

  // toast

  private showToast(severity: string, summary: string, detail?: string) {
    this.messageService.add({ severity, summary, detail, key: 'toast', life: 3000 });
  }
}
