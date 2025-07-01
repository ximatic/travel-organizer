import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

import { Trip } from '../../models/trip.model';
import { tripActions } from '../../store/trips.actions';
import { selectTripsEvent } from '../../store/trips.selectors';
import { TripsEvent, TripsEventName, TripsEventType, TripsState } from '../../store/trips.state';

import { ToastHandlerComponent } from '../../../common/components/toast-handler/toast-handler.component';

import { TripPanelComponent } from '../trip-panel/trip-panel.component';
import { TripItemListComponent } from '../trip-item-list/trip-item-list.component';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
    ButtonModule,
    CardModule,
    PanelModule,
    ProgressSpinnerModule,
    ToastModule,
    TripItemListComponent,
    TripPanelComponent,
  ],
  providers: [TranslateService, MessageService],
})
export class TripComponent extends ToastHandlerComponent implements OnInit, AfterViewInit, OnDestroy {
  // ngrx
  tripsEvent$!: Observable<TripsEvent | null>;

  // trip
  trip = signal<Trip | null>(null);

  // state flags
  isLoading = signal(true);

  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private store: Store<TripsState>,
  ) {
    super();
  }

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

  // initialization

  private init(): void {
    this.subscription.add(
      this.route.params.subscribe((params: Params) => {
        if (params['id']) {
          this.store.dispatch(tripActions.loadTrip({ id: params['id'] }));
        }
      }),
    );
  }

  private initState(): void {
    this.tripsEvent$ = this.store.select(selectTripsEvent);
    this.subscription.add(this.tripsEvent$.subscribe((event: TripsEvent | null) => this.handleTripsEvent(event)));
  }

  private handleTripsEvent(event: TripsEvent | null): void {
    if (!event) {
      return;
    }

    switch (event.name) {
      case TripsEventName.Load:
        this.handleTripsEventLoad(event);
        break;
    }
  }

  private handleTripsEventLoad(event: TripsEvent): void {
    switch (event.type) {
      case TripsEventType.Loading:
        this.isLoading.set(true);
        break;
      case TripsEventType.Success:
        if (event.trip) {
          this.trip.set(event.trip);
        }
        this.isLoading.set(false);
        break;
      case TripsEventType.Error:
        this.isLoading.set(false);
        this.showToastError(event?.message);
        break;
    }
  }
}
