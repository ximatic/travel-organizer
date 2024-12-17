import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';

import { Trip } from '../../models/trip.model';

import { DEFAULT_TRIP_1 } from '../../../common/mocks/constants';

import { TripsComponent } from './trips.component';

describe('TripsComponent', () => {
  let component: TripsComponent;
  let fixture: ComponentFixture<TripsComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TripsComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TripsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('opening trip works', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.openTrip(DEFAULT_TRIP_1);
    expect(navigateSpy).toHaveBeenCalledWith([`/trips/${DEFAULT_TRIP_1.id}`]);
  });

  it('removing trip works', () => {
    // TODO - add proper check for removeTrip
    component.removeTrip(new MouseEvent('click'), DEFAULT_TRIP_1);
    expect(component).toBeTruthy();
  });
});
