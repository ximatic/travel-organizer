import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { delay, filter, Observable, of, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';

import { ActionName, ActionState, TripsActionState, TripsState } from '../../store/trips.state';
import { selectActionState } from '../../store/trips.selectors';
import { tripActions } from '../../store/trips.actions';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-add',
  templateUrl: './trip-add.component.html',
  styleUrl: './trip-add.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    FloatLabelModule,
    InputTextModule,
    PanelModule,
    TextareaModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class TripAddComponent implements OnInit, OnDestroy {
  // ngrx
  actionState$!: Observable<TripsActionState | undefined>;

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
    private messageService: MessageService,
    private store: Store<TripsState>,
  ) {}

  // lifecycle methods

  ngOnInit(): void {
    this.init();
    this.subscription.add(
      this.route.params.subscribe((params: Params) => {
        if (params['id']) {
          this.store.dispatch(tripActions.loadTrip({ id: params['id'] }));
        }
      }),
    );
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
  }

  private initState(): void {
    this.actionState$ = this.store.select(selectActionState);
    this.subscription.add(
      this.actionState$
        .pipe(filter((actionState: TripsActionState | undefined) => this.filterActionState(actionState)))
        .subscribe((actionState: TripsActionState | undefined) => this.handleActionState(actionState)),
    );
  }

  private filterActionState(actionState: TripsActionState | undefined): boolean {
    return (
      actionState?.name === ActionName.LoadTrip ||
      actionState?.name === ActionName.CreateTrip ||
      actionState?.name === ActionName.UpdateTrip
    );
  }

  private handleActionState(actionState: TripsActionState | undefined): void {
    if (!actionState) {
      return;
    }

    switch (actionState?.name) {
      case ActionName.LoadTrip:
        this.handleLoadTrip(actionState);
        break;
      case ActionName.CreateTrip:
        this.handleCreateTrip(actionState);
        break;
      case ActionName.UpdateTrip:
        this.handleUpdateTrip(actionState);
        break;
    }
  }

  private handleLoadTrip(actionState: TripsActionState): void {
    switch (actionState.state) {
      case ActionState.Loading:
        this.isLoading = true;
        break;
      case ActionState.Success:
        if (actionState.trip) {
          this.trip = actionState.trip;
          this.fillForm();
        }
        this.isLoading = false;
        break;
      case ActionState.Error:
        this.isLoading = false;
        this.showToast('error', 'Error', actionState?.message);
        break;
    }
  }

  private handleCreateTrip(actionState: TripsActionState): void {
    switch (actionState.state) {
      case ActionState.Success:
        this.showToast('success', 'Success', actionState?.message);
        if (actionState.trip) {
          this.router.navigate([`/trips/${actionState.trip.id}`]);
        }
        break;
      case ActionState.Error:
        this.showToast('error', 'Error', actionState?.message);
        break;
    }
    this.isSubmitInProgress = true;
  }

  private handleUpdateTrip(actionState: TripsActionState): void {
    switch (actionState.state) {
      case ActionState.Success:
        this.showToast('success', 'Success', actionState?.message);
        if (actionState.trip) {
          this.router.navigate([`/trips/${actionState.trip.id}`]);
        }
        break;
      case ActionState.Error:
        this.showToast('error', 'Error', actionState?.message);
        break;
    }
    this.isSubmitInProgress = true;
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

  private showToast(severity: string, summary: string, detail?: string) {
    this.messageService.add({ severity, summary, detail, key: 'toast', life: 3000 });
  }
}
