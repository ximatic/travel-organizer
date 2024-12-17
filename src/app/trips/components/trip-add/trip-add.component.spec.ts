import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';

import { TripAddComponent } from './trip-add.component';
import { DEFAULT_TRIP_1, DEFAULT_TRIP_2 } from '../../../common/mocks/constants';
import { TripsService } from '../../services/trips.service';

describe('TripAddComponent', () => {
  let component: TripAddComponent;
  let fixture: ComponentFixture<TripAddComponent>;
  let router: Router;
  let tripsService: TripsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TripAddComponent],
      providers: [provideRouter([]), TripsService],
    }).compileComponents();

    localStorage.clear();

    fixture = TestBed.createComponent(TripAddComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    tripsService = TestBed.inject(TripsService);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it("submitTrip doesn't work for an empty form", () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const createSpy = jest.spyOn(tripsService, 'createTrip');
    const updateSpy = jest.spyOn(tripsService, 'updateTrip');

    expect(component.tripForm.invalid).toBeTruthy();
    fixture.whenStable().then(() => {
      expect(component.submitTrip()).toBeUndefined();

      expect(component.tripForm.valid).toBeFalsy();
      expect(createSpy).toHaveBeenCalledTimes(0);
      expect(updateSpy).toHaveBeenCalledTimes(0);
      expect(navigateSpy).toHaveBeenCalledTimes(0);
    });
  });

  it('submitTrip works for a new trip ', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const createSpy = jest.spyOn(tripsService, 'createTrip');

    component.tripForm.patchValue({
      ...DEFAULT_TRIP_1,
    });
    fixture.whenStable().then(() => {
      component.submitTrip();

      expect(component.tripForm.valid).toBeTruthy();
      expect(createSpy).toHaveBeenCalledWith({
        ...DEFAULT_TRIP_1,
      });
      expect(navigateSpy).toHaveBeenCalledWith([`/trips/${DEFAULT_TRIP_1.id}`]);
    });
  });

  it('submitTrip works for an existing trip', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const updateSpy = jest.spyOn(tripsService, 'updateTrip');

    component.trip = DEFAULT_TRIP_2;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.submitTrip();

      expect(component.tripForm.valid).toBeTruthy();
      expect(updateSpy).toHaveBeenCalledWith({
        ...DEFAULT_TRIP_2,
        location: 'Berlin',
      });
      expect(navigateSpy).toHaveBeenCalledWith([`/trips/${DEFAULT_TRIP_2.id}`]);
    });
  });
});
