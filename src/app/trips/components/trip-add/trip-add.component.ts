import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-trip-add',
  templateUrl: './trip-add.component.html',
  styleUrl: './trip-add.component.scss',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    FloatLabelModule,
    InputTextModule,
    PanelModule,
    TextareaModule,
  ],
})
export class TripAddComponent implements OnInit {
  // form
  tripForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.initForm();
  }

  // lifecycle methods

  ngOnInit() {
    // TODO - listen to passed id
  }

  // trip

  addTrip(): void {}

  // form

  private initForm(): void {
    this.tripForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      location: [''],
      startDate: [''],
      endDate: [''],
    });
  }
}
