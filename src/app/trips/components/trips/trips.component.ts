import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, AfterViewInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { InterpolationParameters, TranslatePipe, TranslateService } from '@ngx-translate/core';
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
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
    ButtonModule,
    PanelModule,
    ProgressSpinnerModule,
    ToastModule,
    TripPanelComponent,
  ],
  providers: [TranslateService, MessageService],
})
export class TripsComponent implements OnInit, AfterViewInit, OnDestroy {
  // ngrx
  trips$!: Observable<Trip[]>;
  tripsEvent$!: Observable<TripsEvent | undefined>;

  // data
  trips = signal<Trip[]>([]);
  isLoading = signal(true);

  // other
  private subscription = new Subscription();

  constructor(
    private router: Router,
    private translateService: TranslateService,
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
    this.router.navigate([`/trips/${trip._id}`]);
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
        this.trips.set(trips);
        this.isLoading.set(false);
      }),
    );

    this.tripsEvent$ = this.storeTrips.select(selectTripsEvent);
    this.subscription.add(this.tripsEvent$.subscribe((event: TripsEvent | undefined) => this.handleTripsEvent(event)));
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
        this.isLoading.set(true);
        break;
      case TripsEventType.Success:
        this.isLoading.set(false);
        break;
      case TripsEventType.Error:
        this.isLoading.set(false);
        this.showToastError(event?.message);
        break;
    }
  }

  private handleTripsEventRemove(event: TripsEvent): void {
    switch (event.type) {
      case TripsEventType.Success:
        this.showToastSuccess(event?.message, { trip: event.trip?.name });
        break;
      case TripsEventType.Error:
        this.showToastError(event?.message, { trip: event.trip?.name });
        break;
    }
  }

  // trips

  private loadTrips(): void {
    this.storeTrips.dispatch(tripActions.loadTrips());
  }

  // toast

  private showToastSuccess(detail?: string, detailsParams?: InterpolationParameters) {
    this.showToast(
      'success',
      this.translateService.instant('EVENT.TYPE.SUCCESS'),
      this.translateService.instant(`EVENT.MESSAGE.${detail}`, detailsParams),
    );
  }

  private showToastError(detail?: string, detailsParams?: InterpolationParameters) {
    this.showToast(
      'error',
      this.translateService.instant('EVENT.TYPE.ERROR'),
      this.translateService.instant(`EVENT.MESSAGE.${detail}`, detailsParams),
    );
  }

  private showToast(severity: string, summary: string, detail?: string) {
    this.messageService.add({ severity, summary, detail, key: 'toast', life: 3000 });
  }
}
