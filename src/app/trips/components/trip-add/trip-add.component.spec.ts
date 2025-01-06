/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MessageService } from 'primeng/api';

import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';
import {
  DEFAULT_INITIAL_TRIPS_STATE,
  DEFAULT_TRIP_1,
  DEFAULT_TRIP_2,
  DEFAULT_TRIP_3,
  DEFAULT_TRIP_4,
} from '../../../common/mocks/trips.constants';
import { messageServiceMock } from '../../../common/mocks/services.mocks';

import { TripsEventMessage } from '../../models/trip.model';
import { TripAction } from '../../store/trips.actions';
import { selectTrip, selectTripsEvent } from '../../store/trips.selectors';
import { TripsEventName, TripsEventType } from '../../store/trips.state';

import { TripAddComponent } from './trip-add.component';

describe('TripAddComponent', () => {
  let component: TripAddComponent;
  let fixture: ComponentFixture<TripAddComponent>;
  let router: Router;
  let store: MockStore;
  let messageService: MessageService;

  let mockTripSelector: any;
  let mockTripsEventSelector: any;

  describe('submiting new trip', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TripAddComponent],
        providers: [
          provideRouter([]),
          provideNoopAnimations(),
          provideTranslateService(),
          provideMockStore({ initialState: DEFAULT_INITIAL_TRIPS_STATE }),
          MessageService,
        ],
      }).compileComponents();
      TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });

      router = TestBed.inject(Router);
      store = TestBed.inject(MockStore);
      messageService = TestBed.inject(MessageService);

      mockTripsEventSelector = store.overrideSelector(selectTripsEvent, {
        name: TripsEventName.Load,
        type: TripsEventType.Loading,
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TripAddComponent);
      component = fixture.componentInstance;
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('requesting for trip does not works', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      fixture.detectChanges();

      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it("submitTrip doesn't work for an empty form", () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      fixture.detectChanges();

      expect(component.tripForm.invalid).toBeTruthy();
      expect(component.submitTrip()).toBeUndefined();
      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it('submitTrip works for a new trip ', fakeAsync(() => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      fixture.detectChanges();

      component.tripForm.patchValue({
        ...DEFAULT_TRIP_1,
      });

      expect(component.tripForm.invalid).toBeFalsy();
      component.submitTrip();
      expect(component.isSubmitInProgress).toBeTruthy();

      // artificial delay as in component
      tick(DEFAULT_UX_DELAY);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: TripAction.CreateTrip,
        trip: { name: DEFAULT_TRIP_1.name, location: '', description: '', startDate: undefined, endDate: undefined },
      });
    }));

    // trips event

    it('handling Trips Event with null content works', () => {
      const messageAddSpy = jest.spyOn(messageService, 'add');

      fixture.detectChanges();

      mockTripsEventSelector.setResult(null);

      store.refreshState();

      expect(messageAddSpy).toHaveBeenCalledTimes(0);
    });

    it('handling Trips Event with Create Success works', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const messageAddSpy = jest.spyOn(messageService, 'add');

      fixture.detectChanges();

      mockTripsEventSelector.setResult({
        name: TripsEventName.Create,
        type: TripsEventType.Success,
        message: TripsEventMessage.CREATE_TRIP_SUCCESS,
        trip: DEFAULT_TRIP_3,
      });

      store.refreshState();

      expect(component.isSubmitInProgress).toBeFalsy();
      expect(messageAddSpy).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'EVENT.TYPE.SUCCESS',
        detail: `EVENT.MESSAGE.${TripsEventMessage.CREATE_TRIP_SUCCESS}`,
        key: 'toast',
        life: 3000,
      });
      expect(navigateSpy).toHaveBeenCalledWith([`/trips/${DEFAULT_TRIP_3._id}`]);
    });

    it('handling Trips Event with Create Error works', () => {
      const messageAddSpy = jest.spyOn(messageService, 'add');

      fixture.detectChanges();

      mockTripsEventSelector.setResult({
        name: TripsEventName.Create,
        type: TripsEventType.Error,
        message: TripsEventMessage.CREATE_TRIP_ERROR,
        trip: DEFAULT_TRIP_3,
      });

      store.refreshState();

      expect(component.isSubmitInProgress).toBeFalsy();
      expect(messageAddSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'EVENT.TYPE.ERROR',
        detail: `EVENT.MESSAGE.${TripsEventMessage.CREATE_TRIP_ERROR}`,
        key: 'toast',
        life: 3000,
      });
    });
  });

  describe('submiting existing trip', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TripAddComponent],
        providers: [
          provideRouter([]),
          provideNoopAnimations(),
          provideTranslateService(),
          provideMockStore({ initialState: DEFAULT_INITIAL_TRIPS_STATE }),
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({ id: DEFAULT_TRIP_1._id }),
            },
          },
          MessageService,
        ],
      }).compileComponents();
      TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });

      router = TestBed.inject(Router);
      store = TestBed.inject(MockStore);
      messageService = TestBed.inject(MessageService);

      mockTripSelector = store.overrideSelector(selectTrip, DEFAULT_TRIP_1);
      mockTripsEventSelector = store.overrideSelector(selectTripsEvent, {
        name: TripsEventName.Load,
        type: TripsEventType.Loading,
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TripAddComponent);
      component = fixture.componentInstance;
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('requesting for trip works', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      fixture.detectChanges();

      expect(dispatchSpy).toHaveBeenCalledWith({ type: TripAction.LoadTrip, id: DEFAULT_TRIP_1._id });
    });

    it('loading trip works', () => {
      fixture.detectChanges();

      mockTripSelector.setResult(DEFAULT_TRIP_2);
      mockTripsEventSelector.setResult({
        name: TripsEventName.Load,
        type: TripsEventType.Success,
        trip: DEFAULT_TRIP_2,
      });

      store.refreshState();

      expect(component.trip).toEqual(DEFAULT_TRIP_2);
      expect(component.isLoading).toBeFalsy();
    });

    it('submitTrip works for an existing trip ', fakeAsync(() => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      fixture.detectChanges();

      component.trip = DEFAULT_TRIP_1;
      component.tripForm.patchValue({
        ...DEFAULT_TRIP_1,
        location: 'Berlin',
      });

      expect(component.tripForm.invalid).toBeFalsy();
      component.submitTrip();
      expect(component.isSubmitInProgress).toBeTruthy();

      // artificial delay as in component
      tick(DEFAULT_UX_DELAY);

      expect(dispatchSpy).toHaveBeenLastCalledWith({
        type: TripAction.UpdateTrip,
        trip: {
          _id: DEFAULT_TRIP_1._id,
          name: DEFAULT_TRIP_1.name,
          location: 'Berlin',
          description: '',
          startDate: undefined,
          endDate: undefined,
        },
      });
    }));

    // trips event

    it('handling Trips Event with null content works', () => {
      const messageAddSpy = jest.spyOn(messageService, 'add');

      fixture.detectChanges();

      mockTripsEventSelector.setResult(null);

      store.refreshState();

      expect(messageAddSpy).toHaveBeenCalledTimes(0);
    });

    it('handling Trips Event with Load Success works', () => {
      const messageAddSpy = jest.spyOn(messageService, 'add');

      fixture.detectChanges();

      mockTripsEventSelector.setResult({
        name: TripsEventName.Load,
        type: TripsEventType.Success,
        trip: DEFAULT_TRIP_4,
      });

      store.refreshState();

      expect(component.isLoading).toBeFalsy();
      expect(messageAddSpy).toHaveBeenCalledTimes(0);
    });

    it('handling Trips Event with Load Error works', () => {
      const messageAddSpy = jest.spyOn(messageService, 'add');

      fixture.detectChanges();

      mockTripsEventSelector.setResult({
        name: TripsEventName.Load,
        type: TripsEventType.Error,
        message: TripsEventMessage.LOAD_TRIP_ERROR,
      });

      store.refreshState();

      expect(component.isLoading).toBeFalsy();
      expect(messageAddSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'EVENT.TYPE.ERROR',
        detail: `EVENT.MESSAGE.${TripsEventMessage.LOAD_TRIP_ERROR}`,
        key: 'toast',
        life: 3000,
      });
    });

    it('handling Trips Event with Update Success works', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const messageAddSpy = jest.spyOn(messageService, 'add');

      fixture.detectChanges();

      mockTripsEventSelector.setResult({
        name: TripsEventName.Update,
        type: TripsEventType.Success,
        message: TripsEventMessage.UPDATE_TRIP_SUCCESS,
        trip: DEFAULT_TRIP_1,
      });

      store.refreshState();

      expect(component.isSubmitInProgress).toBeFalsy();
      expect(messageAddSpy).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'EVENT.TYPE.SUCCESS',
        detail: `EVENT.MESSAGE.${TripsEventMessage.UPDATE_TRIP_SUCCESS}`,
        key: 'toast',
        life: 3000,
      });
      expect(navigateSpy).toHaveBeenCalledWith([`/trips/${DEFAULT_TRIP_1._id}`]);
    });

    it('handling Trips Event with Update Error works', () => {
      const messageAddSpy = jest.spyOn(messageService, 'add');

      fixture.detectChanges();

      mockTripsEventSelector.setResult({
        name: TripsEventName.Update,
        type: TripsEventType.Error,
        message: TripsEventMessage.UPDATE_TRIP_ERROR,
        trip: DEFAULT_TRIP_1,
      });

      store.refreshState();

      expect(component.isSubmitInProgress).toBeFalsy();
      expect(messageAddSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'EVENT.TYPE.ERROR',
        detail: `EVENT.MESSAGE.${TripsEventMessage.UPDATE_TRIP_ERROR}`,
        key: 'toast',
        life: 3000,
      });
    });
  });
});
