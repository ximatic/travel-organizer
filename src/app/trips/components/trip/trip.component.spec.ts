import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { DEFAULT_INITIAL_TRIPS_STATE, DEFAULT_TRIP_1, DEFAULT_TRIP_2 } from '../../../common/mocks/constants';

import { TripAction } from '../../store/trips.actions';
import { selectActionState, selectTrip } from '../../store/trips.selectors';
import { ActionName, ActionState } from '../../store/trips.state';

import { TripComponent } from './trip.component';

describe('TripComponent', () => {
  let component: TripComponent;
  let fixture: ComponentFixture<TripComponent>;
  let store: MockStore;

  let mockTripSelector: any;
  let mockActionStateSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TripComponent],
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
});
