import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, skip, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

import { Trip } from '../../models/trip.model';
import { tripActions } from '../../store/trips.actions';
import { selectTripsEvent, selectTrips } from '../../store/trips.selectors';
import { TripsEvent, TripsEventName, TripsEventType, TripsState } from '../../store/trips.state';

import { TripPanelComponent } from '../trip-panel/trip-panel.component';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, PanelModule, ProgressSpinnerModule, ToastModule, TripPanelComponent],
  providers: [MessageService],
})
export class TripsComponent implements OnInit, AfterViewInit, OnDestroy {
  // ngrx
  trips$!: Observable<Trip[]>;
  tripsEvent$!: Observable<TripsEvent | undefined>;

  // data
  trips: Trip[] = [];
  isLoading = true;

  // other
  private subscription = new Subscription();

  constructor(
    private router: Router,
    private messageService: MessageService,
    private storeTrips: Store<TripsState>,
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

    this.tripsEvent$ = this.storeTrips.select(selectTripsEvent);
    this.subscription.add(
      this.tripsEvent$.pipe(skip(1)).subscribe((event: TripsEvent | undefined) => this.handleTripsEvent(event)),
    );
  }

  private handleTripsEvent(event: TripsEvent | undefined): void {
    if (!event) {
      return;
    }

    switch (event.name) {
      case TripsEventName.LoadAll:
        this.handleTripsEventLoadAll(event);
        break;
      case TripsEventName.Remove:
        this.handleTripsEventRemove(event);
        break;
    }
  }

  private handleTripsEventLoadAll(event: TripsEvent): void {
    switch (event.type) {
      case TripsEventType.Loading:
        this.isLoading = true;
        break;
      case TripsEventType.Success:
        this.isLoading = false;
        break;
      case TripsEventType.Error:
        this.isLoading = false;
        this.showToast('error', 'Error', event?.message);
        break;
    }
  }

  private handleTripsEventRemove(event: TripsEvent): void {
    switch (event.type) {
      case TripsEventType.Success:
        this.showToast('success', 'Success', event?.message);
        break;
      case TripsEventType.Error:
        this.showToast('error', 'Error', event?.message);
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
