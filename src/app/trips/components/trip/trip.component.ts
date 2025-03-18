import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { InterpolationParameters, TranslatePipe, TranslateService } from '@ngx-translate/core';
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

import { TripPanelComponent } from '../trip-panel/trip-panel.component';
import { TripItemsComponent } from '../trip-items/trip-items.component';

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
    TripItemsComponent,
    TripPanelComponent,
  ],
  providers: [TranslateService, MessageService],
})
export class TripComponent implements OnInit, AfterViewInit, OnDestroy {
  // ngrx
  tripsEvent$!: Observable<TripsEvent | undefined>;

  // trip
  trip!: Trip | null;

  // state flags
  isLoading = signal(true);

  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private messageService: MessageService,
    private store: Store<TripsState>,
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
    this.subscription.add(this.tripsEvent$.subscribe((event: TripsEvent | undefined) => this.handleTripsEvent(event)));
  }

  private handleTripsEvent(event: TripsEvent | undefined): void {
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
          this.trip = event.trip;
        }
        this.isLoading.set(false);
        break;
      case TripsEventType.Error:
        this.isLoading.set(false);
        this.showToastError(event?.message);
        break;
    }
  }

  // toast

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
