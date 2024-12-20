/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';
import { DEFAULT_INITIAL_TRIPS_STATE, DEFAULT_TRIP_1, DEFAULT_TRIP_2 } from '../../../common/mocks/trips.constants';

import { TripAction } from '../../store/trips.actions';
import { selectTrip, selectActionState } from '../../store/trips.selectors';
import { ActionName, ActionState } from '../../store/trips.state';

import { TripAddComponent } from './trip-add.component';

describe('TripAddComponent', () => {
  let component: TripAddComponent;
  let fixture: ComponentFixture<TripAddComponent>;
  let store: MockStore;
  let mockTripSelector: any;
  let mockActionStateSelector: any;

  describe('submiting new trip', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, TripAddComponent],
        providers: [provideRouter([]), provideMockStore({ initialState: DEFAULT_INITIAL_TRIPS_STATE })],
      }).compileComponents();

      store = TestBed.inject(MockStore);
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
  });

  describe('submiting existing trip', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, TripAddComponent],
        providers: [
          provideRouter([]),
          provideMockStore({ initialState: DEFAULT_INITIAL_TRIPS_STATE }),
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({ id: DEFAULT_TRIP_1.id }),
            },
          },
        ],
      }).compileComponents();

      store = TestBed.inject(MockStore);

      mockTripSelector = store.overrideSelector(selectTrip, DEFAULT_TRIP_1);
      mockActionStateSelector = store.overrideSelector(selectActionState, {
        name: ActionName.LoadTrip,
        state: ActionState.Loading,
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

      expect(dispatchSpy).toHaveBeenCalledWith({ type: TripAction.LoadTrip, id: DEFAULT_TRIP_1.id });
    });

    it('loading trip works', () => {
      fixture.detectChanges();

      mockTripSelector.setResult(DEFAULT_TRIP_2);
      mockActionStateSelector.setResult({
        name: ActionName.LoadTrip,
        state: ActionState.Success,
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
          id: DEFAULT_TRIP_1.id,
          name: DEFAULT_TRIP_1.name,
          location: 'Berlin',
          description: '',
          startDate: undefined,
          endDate: undefined,
        },
      });
    }));
  });
});
