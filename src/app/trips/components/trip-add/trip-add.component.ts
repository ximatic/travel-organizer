import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';

import { Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TextareaModule } from 'primeng/textarea';

import { TripsService } from '../../services/trips.service';
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
  ],
  providers: [TripsService],
})
export class TripAddComponent implements OnInit, OnDestroy {
  // trip
  trip?: Trip | null;

  // form
  tripForm!: FormGroup;

  // other
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private tripsService: TripsService,
  ) {
    this.initForm();
  }

  // lifecycle methods

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe((params: Params) => {
        this.trip = this.tripsService.loadTrip(params['id']);
        this.fillForm();
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

    if (this.trip) {
      const trip = {
        ...this.trip,
        ...this.processFormValue(),
      };
      this.tripsService.updateTrip(trip);
      this.router.navigate([`/trips/${trip.id}`]);
    } else {
      const trip = this.tripsService.createTrip(this.processFormValue());
      this.router.navigate([`/trips/${trip.id}`]);
    }
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
}
