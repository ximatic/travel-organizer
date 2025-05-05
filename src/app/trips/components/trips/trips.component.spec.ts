/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

import { MOCK_INITIAL_TRIPS_STATE, MOCK_TRIP_1, MOCK_TRIP_2 } from '../../../../../__mocks__/constants/trips.constants';
import { messageServiceMock } from '../../../../../__mocks__/services.mocks';

import { TripsEventMessage } from '../../models/trip.model';
import { TripAction } from '../../store/trips.actions';
import { selectTrips, selectTripsEvent } from '../../store/trips.selectors';
import { TripsEventName, TripsEventType } from '../../store/trips.state';

import { TripsComponent } from './trips.component';

describe('TripsComponent', () => {
  let component: TripsComponent;
  let fixture: ComponentFixture<TripsComponent>;
  let router: Router;
  let store: MockStore;
  let messageService: MessageService;

  let mockTripsSelector: any;
  let mockTripsEventSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripsComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideTranslateService(),
        provideMockStore({ initialState: MOCK_INITIAL_TRIPS_STATE }),
        MessageService,
      ],
    }).compileComponents();
    TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    messageService = TestBed.inject(MessageService);

    mockTripsSelector = store.overrideSelector(selectTrips, []);
    mockTripsEventSelector = store.overrideSelector(selectTripsEvent, {
      name: TripsEventName.LoadAll,
      type: TripsEventType.Loading,
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('requesting for trips works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.isLoading).toBeTruthy();
    expect(dispatchSpy).toHaveBeenCalledWith({ type: TripAction.LoadTrips });
  });

  it('loading trips works', () => {
    fixture.detectChanges();

    mockTripsSelector.setResult([MOCK_TRIP_1, MOCK_TRIP_2]);

    store.refreshState();

    expect(component.trips()).toEqual([MOCK_TRIP_1, MOCK_TRIP_2]);
    expect(component.isLoading()).toBeFalsy();
  });

  it('opening trip works', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.openTrip(MOCK_TRIP_1);
    expect(navigateSpy).toHaveBeenCalledWith([`/trips/${MOCK_TRIP_1._id}`]);
  });

  it('removing trip works', () => {
    // TODO - add proper check for removeTrip
    component.removeTrip(new MouseEvent('click'), MOCK_TRIP_1);
    expect(component).toBeTruthy();
  });

  // trips event

  it('handling Trips Event with null content works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult(null);

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('handling Trips Event with Load All Loading works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult({
      name: TripsEventName.LoadAll,
      type: TripsEventType.Loading,
    });

    store.refreshState();

    expect(component.isLoading()).toBeTruthy();
    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('handling Trips Event with Load All Success works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult({
      name: TripsEventName.LoadAll,
      type: TripsEventType.Success,
    });

    store.refreshState();

    expect(component.isLoading()).toBeFalsy();
    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('handling Trips Event with Load All Error works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult({
      name: TripsEventName.LoadAll,
      type: TripsEventType.Error,
      message: TripsEventMessage.LOAD_TRIPS_ERROR,
    });

    store.refreshState();

    expect(component.isLoading()).toBeFalsy();
    expect(messageAddSpy).toHaveBeenLastCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${TripsEventMessage.LOAD_TRIPS_ERROR}`,
      key: 'toast',
      life: 3000,
    });
  });

  it('handling Trips Event with Remove Success works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult({
      name: TripsEventName.Remove,
      type: TripsEventType.Success,
      trip: MOCK_TRIP_1,
      message: TripsEventMessage.REMOVE_TRIP_SUCCESS,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenLastCalledWith({
      severity: 'success',
      summary: 'EVENT.TYPE.SUCCESS',
      detail: `EVENT.MESSAGE.${TripsEventMessage.REMOVE_TRIP_SUCCESS}`,
      key: 'toast',
      life: 3000,
    });
  });

  it('handling Trips Event with Remove Error works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult({
      name: TripsEventName.Remove,
      type: TripsEventType.Error,
      trip: MOCK_TRIP_1,
      message: TripsEventMessage.REMOVE_TRIP_ERROR,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenLastCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${TripsEventMessage.REMOVE_TRIP_ERROR}`,
      key: 'toast',
      life: 3000,
    });
  });
});
