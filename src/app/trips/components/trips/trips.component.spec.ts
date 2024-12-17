import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Trip } from '../../models/trip.model';

import { TripsComponent } from './trips.component';

describe('TripsComponent', () => {
  let component: TripsComponent;
  let fixture: ComponentFixture<TripsComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripsComponent],
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
    const trip: Trip = {
      id: 'trip-1',
      name: 'Test trip #1',
      description: 'test description for the trip',
    };

    component.openTrip(trip);
    expect(navigateSpy).toHaveBeenCalledWith([`/trips/${trip.id}`]);
  });
});
