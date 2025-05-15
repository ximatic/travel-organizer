import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { InterpolationParameters, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { delay, Observable, of, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';

import { Trip } from '../../models/trip.model';
import { tripActions } from '../../store/trips.actions';
import { selectTripsEvent } from '../../store/trips.selectors';
import { TripsEvent, TripsEventName, TripsEventType, TripsState } from '../../store/trips.state';

import { ToastHandlerComponent } from '../../../common/components/toast-handler/toast-handler.component';

@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  styleUrl: './trip-form.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslatePipe,
    ButtonModule,
    DatePickerModule,
    FloatLabelModule,
    InputTextModule,
    PanelModule,
    TextareaModule,
    ToastModule,
  ],
  providers: [TranslateService, MessageService],
})
export class TripFormComponent extends ToastHandlerComponent implements OnInit, OnDestroy {
  // ngrx
  tripsEvent$!: Observable<TripsEvent | null>;

  // trip
  trip = signal<Trip | null>(null);

  // state flags
  isLoading = signal(true);
  isSubmitInProgress = signal(false);

  // form
  tripForm!: FormGroup;

  // other
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private store: Store<TripsState>,
  ) {
    super();
  }

  // lifecycle methods

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // controls

  get nameControl(): AbstractControl | null {
    return this.tripForm.get('name');
  }

  // trip

  submitTrip(): void {
    if (this.tripForm.invalid) {
      // TODO - show error?
      return;
    }

    this.isSubmitInProgress.set(true);
    // artificial delay to improve UX
    of({})
      .pipe(delay(DEFAULT_UX_DELAY))
      .subscribe(() => {
        if (this.trip()) {
          const trip = {
            ...this.trip(),
            ...this.processFormValue(),
          };
          this.store.dispatch(tripActions.updateTrip({ trip }));
        } else {
          const trip = this.processFormValue();
          this.store.dispatch(tripActions.createTrip({ trip }));
        }
      });
  }

  // initialization

  private init(): void {
    this.initForm();
    this.initState();
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
      case TripsEventName.Create:
        this.handleTripsEventCreate(event);
        break;
      case TripsEventName.Update:
        this.handleTripsEventUpdate(event);
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
          this.fillForm();
        }
        this.isLoading.set(false);
        break;
      case TripsEventType.Error:
        this.isLoading.set(false);
        this.showToastError(event?.message);
        break;
    }
  }

  private handleTripsEventCreate(event: TripsEvent): void {
    switch (event.type) {
      case TripsEventType.Success:
        this.showToastSuccess(event?.message, { trip: event.trip?.name });
        if (event.trip) {
          this.router.navigate([`/trips/${event.trip._id}`]);
        }
        break;
      case TripsEventType.Error:
        this.showToastError(event?.message, { trip: event.trip?.name });
        break;
    }
    this.isSubmitInProgress.set(false);
  }

  private handleTripsEventUpdate(event: TripsEvent): void {
    switch (event.type) {
      case TripsEventType.Success:
        this.showToastSuccess(event?.message, { trip: event.trip?.name });
        if (event.trip) {
          this.router.navigate([`/trips/${event.trip._id}`]);
        }
        break;
      case TripsEventType.Error:
        this.showToastError(event?.message, { trip: event.trip?.name });
        break;
    }
    this.isSubmitInProgress.set(false);
  }

  // form

  private processFormValue(): Trip {
    const { name, location, description, date } = this.tripForm.getRawValue();
    const trip: Trip = {
      name,
      location,
      description,
      startDate: date[0],
      endDate: date[1],
    };

    return trip;
  }

  private initForm(): void {
    this.tripForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      location: [''],
      date: [''],
    });
  }

  private fillForm(): void {
    if (this.trip()) {
      const { name, location, description, startDate, endDate } = this.trip() as Trip;
      this.tripForm.patchValue({
        name,
        location,
        description,
        date: startDate && endDate ? [new Date(startDate), new Date(endDate)] : [],
      });
    }
  }
}
