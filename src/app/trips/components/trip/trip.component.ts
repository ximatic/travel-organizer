import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { filter, Observable, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

import { ActionName, ActionState, TripsActionState, TripsState } from '../../store/trips.state';
import { selectActionState } from '../../store/trips.selectors';
import { tripActions } from '../../store/trips.actions';
import { Trip } from '../../models/trip.model';

import { TripPanelComponent } from '../trip-panel/trip-panel.component';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    PanelModule,
    ProgressSpinnerModule,
    ToastModule,
    TripPanelComponent,
  ],
  providers: [MessageService],
})
export class TripComponent implements OnInit, OnDestroy {
  // ngrx
  actionState$!: Observable<TripsActionState | undefined>;

  // trip
  trip!: Trip | null;
  isLoading: boolean = true;

  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
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

  // initialization

  private init(): void {
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
    return actionState?.name === ActionName.LoadTrip;
  }

  private handleActionState(actionState: TripsActionState | undefined): void {
    if (!actionState) {
      return;
    }

    switch (actionState?.name) {
      case ActionName.LoadTrip:
        this.handleLoadTrip(actionState);
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
        }
        this.isLoading = false;
        break;
      case ActionState.Error:
        this.isLoading = false;
        this.showToast('error', 'Error', actionState?.message);
        break;
    }
  }

  // toast

  private showToast(severity: string, summary: string, detail?: string) {
    this.messageService.add({ severity, summary, detail, key: 'toast', life: 3000 });
  }
}
