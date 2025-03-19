import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { InterpolationParameters, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { delay, Observable, of, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';

import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';

import { Trip, TripItem } from '../../models/trip.model';
import { tripItemActions } from '../../store/trips.actions';
import { selectTripsEvent } from '../../store/trips.selectors';
import { TripsEvent, TripsEventName, TripsEventType, TripsState } from '../../store/trips.state';

@Component({
  selector: 'app-trip-items',
  templateUrl: './trip-items.component.html',
  styleUrl: './trip-items.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslatePipe,
    ButtonModule,
    CardModule,
    DividerModule,
    FloatLabelModule,
    InputTextModule,
    PanelModule,
    ToastModule,
  ],
  providers: [TranslateService, MessageService],
})
export class TripItemsComponent implements OnInit, AfterViewInit, OnDestroy {
  // ngrx
  tripsEvent$!: Observable<TripsEvent | undefined>;

  // trip
  @Input() trip!: Trip;

  // state flags
  isSubmitInProgress = signal(false);

  // form
  tripItemForm!: FormGroup;

  private subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
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

  // trip item

  checkTripItem(tripItem: TripItem): void {
    this.store.dispatch(tripItemActions.checkTripItem({ trip: this.trip, tripItem }));
  }

  removeTripItem(tripItem: TripItem): void {
    this.store.dispatch(tripItemActions.removeTripItem({ trip: this.trip, tripItem }));
  }

  submitTripItem(): void {
    if (this.tripItemForm.invalid) {
      return;
    }

    this.isSubmitInProgress.set(true);
    // artificial delay to improve UX
    of({})
      .pipe(delay(DEFAULT_UX_DELAY))
      .subscribe(() => {
        const tripItem = this.processFormValue();
        this.store.dispatch(tripItemActions.createTripItem({ trip: this.trip, tripItem }));
      });
  }

  // initialization

  private init(): void {
    this.initForm();
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
      case TripsEventName.CreateItem:
        this.handleTripsEvenCreateItem(event);
        break;
      case TripsEventName.CheckItem:
        this.handleTripsEvenCheckItem(event);
        break;
      case TripsEventName.RemoveItem:
        this.handleTripsEventRemoveItem(event);
        break;
    }
  }

  private handleTripsEvenCreateItem(event: TripsEvent): void {
    switch (event.type) {
      case TripsEventType.Success:
        if (event.trip) {
          this.trip = event.trip;
        }
        this.clearForm();
        break;
      case TripsEventType.Error:
        this.showToastError(event?.message);
        break;
    }
    this.isSubmitInProgress.set(false);
  }

  private handleTripsEvenCheckItem(event: TripsEvent): void {
    switch (event.type) {
      case TripsEventType.Success:
        if (event.trip) {
          this.trip = event.trip;
        }
        this.clearForm();
        break;
      case TripsEventType.Error:
        this.showToastError(event?.message);
        break;
    }
  }

  private handleTripsEventRemoveItem(event: TripsEvent): void {
    switch (event.type) {
      case TripsEventType.Success:
        if (event.trip) {
          this.trip = event.trip;
        }
        break;
      case TripsEventType.Error:
        this.showToastError(event?.message);
        break;
    }
  }

  // form

  private processFormValue(): TripItem {
    const { name } = this.tripItemForm.getRawValue();
    const tripItem: TripItem = {
      name,
      checked: false,
    };

    return tripItem;
  }

  private clearForm(): void {
    this.tripItemForm.reset();
  }

  private initForm(): void {
    this.tripItemForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
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
