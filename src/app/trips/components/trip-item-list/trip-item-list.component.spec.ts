/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MessageService } from 'primeng/api';

import { MOCK_INITIAL_TRIPS_STATE, MOCK_TRIP_1, MOCK_TRIP_ITEM_1 } from '../../../../../__mocks__/constants/trips.constants';
import { messageServiceMock } from '../../../../../__mocks__/services.mocks';

import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';

import { TripsEventMessage } from '../../models/trip.model';
import { TripItemAction } from '../../store/trips.actions';
import { selectTripsEvent } from '../../store/trips.selectors';
import { TripsEventName, TripsEventType } from '../../store/trips.state';

import { TripItemListComponent } from './trip-item-list.component';

describe('TripItemListComponent', () => {
  let component: TripItemListComponent;
  let fixture: ComponentFixture<TripItemListComponent>;
  let store: MockStore;
  let messageService: MessageService;

  let mockTripsEventSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripItemListComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideTranslateService(),
        provideMockStore({ initialState: MOCK_INITIAL_TRIPS_STATE }),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: MOCK_TRIP_1._id }),
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
    fixture = TestBed.createComponent(TripItemListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('trip', MOCK_TRIP_1);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('checkTripItem works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.checkTripItem(MOCK_TRIP_ITEM_1);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: TripItemAction.CheckTripItem,
      trip: MOCK_TRIP_1,
      tripItem: MOCK_TRIP_ITEM_1,
    });
  });

  it('removeTripItem works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.removeTripItem(MOCK_TRIP_ITEM_1);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: TripItemAction.RemoveTripItem,
      trip: MOCK_TRIP_1,
      tripItem: MOCK_TRIP_ITEM_1,
    });
  });

  it("submitTripItem doesn't works for an empty form", fakeAsync(() => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.tripItemForm.invalid).toBeTruthy();
    expect(component.submitTripItem()).toBeUndefined();
    expect(component.isSubmitInProgress()).toBeFalsy();

    // artificial delay as in component
    tick(DEFAULT_UX_DELAY);

    expect(dispatchSpy).toHaveBeenCalledTimes(0);
  }));

  it('submitTripItem works for filled form', fakeAsync(() => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.tripItemForm.patchValue({
      name: MOCK_TRIP_ITEM_1.name,
    });

    expect(component.tripItemForm.invalid).toBeFalsy();
    component.submitTripItem();
    expect(component.isSubmitInProgress()).toBeTruthy();

    // artificial delay as in component
    tick(DEFAULT_UX_DELAY);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: TripItemAction.CreateTripItem,
      trip: MOCK_TRIP_1,
      tripItem: { name: MOCK_TRIP_ITEM_1.name, checked: false },
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

  it('handling Trips Event with Create Item Success works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult({
      name: TripsEventName.CreateItem,
      type: TripsEventType.Success,
      trip: { ...MOCK_TRIP_1, items: [MOCK_TRIP_ITEM_1] },
    });

    store.refreshState();

    expect(component.tripItemForm.invalid).toBeTruthy();
    expect(component.isSubmitInProgress()).toBeFalsy();
    expect(component.trip()).toEqual({ ...MOCK_TRIP_1, items: [MOCK_TRIP_ITEM_1] });
    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('handling Trips Event with Create Item Error works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult({
      name: TripsEventName.CreateItem,
      type: TripsEventType.Error,
      message: TripsEventMessage.CREATE_TRIP_ITEM_ERROR,
    });

    store.refreshState();

    expect(component.isSubmitInProgress()).toBeFalsy();
    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${TripsEventMessage.CREATE_TRIP_ITEM_ERROR}`,
      key: 'main-toast',
      life: 3000,
    });
  });

  it('handling Trips Event with Check Item Success works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult({
      name: TripsEventName.CheckItem,
      type: TripsEventType.Success,
      trip: { ...MOCK_TRIP_1, items: [MOCK_TRIP_ITEM_1] },
    });

    store.refreshState();

    expect(component.trip()).toEqual({ ...MOCK_TRIP_1, items: [MOCK_TRIP_ITEM_1] });
    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('handling Trips Event with Check Item Error works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult({
      name: TripsEventName.CheckItem,
      type: TripsEventType.Error,
      message: TripsEventMessage.CHECK_TRIP_ITEM_ERROR,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${TripsEventMessage.CHECK_TRIP_ITEM_ERROR}`,
      key: 'main-toast',
      life: 3000,
    });
  });

  it('handling Trips Event with Remove Item Success works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult({
      name: TripsEventName.RemoveItem,
      type: TripsEventType.Success,
      trip: { ...MOCK_TRIP_1, items: [MOCK_TRIP_ITEM_1] },
    });

    store.refreshState();

    expect(component.trip()).toEqual({ ...MOCK_TRIP_1, items: [MOCK_TRIP_ITEM_1] });
    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('handling Trips Event with Remove Item Error works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockTripsEventSelector.setResult({
      name: TripsEventName.RemoveItem,
      type: TripsEventType.Error,
      message: TripsEventMessage.REMOVE_TRIP_ITEM_ERROR,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${TripsEventMessage.REMOVE_TRIP_ITEM_ERROR}`,
      key: 'main-toast',
      life: 3000,
    });
  });
});
