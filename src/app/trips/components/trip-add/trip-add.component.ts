import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-trip-add',
  templateUrl: './trip-add.component.html',
  styleUrl: './trip-add.component.scss',
  standalone: true,
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
export class TripAddComponent implements OnInit, OnDestroy {
  // ngrx
  tripsEvent$!: Observable<TripsEvent | undefined>;

  // trip
  trip?: Trip | null;

  // state flags
  isLoading = true;
  isSubmitInProgress = false;

  // form
  tripForm!: FormGroup;

  // other
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private store: Store<TripsState>,
  ) {}

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

    this.isSubmitInProgress = true;
    // artificial delay to improve UX
    of({})
      .pipe(delay(DEFAULT_UX_DELAY))
      .subscribe(() => {
        if (this.trip) {
          const trip = {
            ...this.trip,
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
        this.isLoading = true;
        break;
      case TripsEventType.Success:
        if (event.trip) {
          this.trip = event.trip;
          this.fillForm();
        }
        this.isLoading = false;
        break;
      case TripsEventType.Error:
        this.isLoading = false;
        this.showToastError(event?.message);
        break;
    }
  }

  private handleTripsEventCreate(event: TripsEvent): void {
    switch (event.type) {
      case TripsEventType.Success:
        this.showToastSuccess(event?.message, { trip: event.trip?.name });
        if (event.trip) {
          this.router.navigate([`/trips/${event.trip.id}`]);
        }
        break;
      case TripsEventType.Error:
        this.showToastError(event?.message, { trip: event.trip?.name });
        break;
    }
    this.isSubmitInProgress = false;
  }

  private handleTripsEventUpdate(event: TripsEvent): void {
    switch (event.type) {
      case TripsEventType.Success:
        this.showToastSuccess(event?.message, { trip: event.trip?.name });
        if (event.trip) {
          this.router.navigate([`/trips/${event.trip.id}`]);
        }
        break;
      case TripsEventType.Error:
        this.showToastError(event?.message, { trip: event.trip?.name });
        break;
    }
    this.isSubmitInProgress = false;
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
    if (this.trip) {
      const { name, location, description, startDate, endDate } = this.trip;
      this.tripForm.patchValue({
        name,
        location,
        description,
        date: startDate && endDate ? [new Date(startDate), new Date(endDate)] : [],
      });
    }
  }

  // toasts

  private showToastSuccess(detail?: string, detailsParams?: InterpolationParameters) {
    this.showToast(
      'success',
      this.translateService.instant('EVENT.TYPE.SUCCESS'),
      this.translateService.instant(`EVENT.MESSAGE.${detail}`, detailsParams),
    );
  }

  private showToastError(detail?: string, detailsParams?: InterpolationParameters) {
    console.log(detailsParams);
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
