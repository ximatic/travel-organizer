/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { MessageService } from 'primeng/api';

import { DEFAULT_INITIAL_TRIPS_STATE, DEFAULT_TRIP_1, DEFAULT_TRIP_2 } from '../../../common/mocks/trips.constants';
import { messageServiceMock } from '../../../common/mocks/services.mocks';

import { TripAction } from '../../store/trips.actions';
import { selectTripsEvent } from '../../store/trips.selectors';
import { TripsEventName, TripsEventType } from '../../store/trips.state';

import { TripComponent } from './trip.component';

describe('TripComponent', () => {
  let component: TripComponent;
  let fixture: ComponentFixture<TripComponent>;
  let store: MockStore;
  let messageService: MessageService;

  let mockTripsEventSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideMockStore({ initialState: DEFAULT_INITIAL_TRIPS_STATE }),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: DEFAULT_TRIP_1.id }),
          },
        },
        MessageService,
      ],
    }).compileComponents();
    TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });

    store = TestBed.inject(MockStore);
    messageService = TestBed.inject(MessageService);

    mockTripsEventSelector = store.overrideSelector(selectTripsEvent, {
      name: TripsEventName.Load,
      type: TripsEventType.Loading,
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('requesting for trip works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.isLoading).toBeTruthy();
    expect(dispatchSpy).toHaveBeenCalledWith({ type: TripAction.LoadTrip, id: DEFAULT_TRIP_1.id });
  });

  // trips event

  it('handling Trips Event with null content works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult(null);

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('handling Trips Event with Load Loading works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult({
      name: TripsEventName.Load,
      type: TripsEventType.Loading,
    });

    store.refreshState();

    expect(component.isLoading).toBeTruthy();
    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('handling Trips Event with Load Success works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult({
      name: TripsEventName.Load,
      type: TripsEventType.Success,
      trip: DEFAULT_TRIP_2,
    });

    store.refreshState();

    expect(component.isLoading).toBeFalsy();
    expect(component.trip).toEqual(DEFAULT_TRIP_2);
    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('handling Trips Event with Load Error works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult({
      name: TripsEventName.Load,
      type: TripsEventType.Error,
      message: 'No trip',
    });

    store.refreshState();

    expect(component.isLoading).toBeFalsy();
    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'No trip',
      key: 'toast',
      life: 3000,
    });
  });
});
