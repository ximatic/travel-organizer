import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Trip } from '../models/trip.model';

import { DEFAULT_TRIP_1, DEFAULT_TRIP_2, DEFAULT_TRIP_ITEM_1 } from '../../../../__mocks__/constants/trips.constants';

import { TripsHttpService } from './trips-http.service';
import { environment } from '../../../environments/environment';

describe('TripsHttpService', () => {
  let httpMock: HttpTestingController;
  let service: TripsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), TripsHttpService],
      teardown: { destroyAfterEach: false },
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TripsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // trips

  // loadTrips

  it('loading trips with empty result works', fakeAsync(() => {
    const mockData: Trip[] = [];
    const expectedResponse: Trip[] = [];
    let serviceResponse!: Trip[];

    service.loadTrips().subscribe((trips: Trip[]) => {
      serviceResponse = trips;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('GET');
    expect(serviceResponse).toEqual(expectedResponse);
  }));

  it('loading trips with non-empty result works', fakeAsync(() => {
    const mockData: Trip[] = [DEFAULT_TRIP_1, DEFAULT_TRIP_2];
    const expectedResponse: Trip[] = [DEFAULT_TRIP_1, DEFAULT_TRIP_2];
    let serviceResponse!: Trip[];

    service.loadTrips().subscribe((trips: Trip[]) => {
      serviceResponse = trips;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('GET');
    expect(serviceResponse).toEqual(expectedResponse);
  }));

  // loadTrip

  it('loading trip with non-empty result works', fakeAsync(() => {
    const mockData: Trip = DEFAULT_TRIP_1;
    const expectedResponse: Trip = DEFAULT_TRIP_1;
    let serviceResponse!: Trip;

    service.loadTrip(DEFAULT_TRIP_1._id as string).subscribe((trip: Trip) => {
      serviceResponse = trip;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}/${DEFAULT_TRIP_1._id}`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('GET');
    expect(serviceResponse).toEqual(expectedResponse);
  }));

  // createTrip

  it('creating trip works', fakeAsync(() => {
    const mockData: Trip = DEFAULT_TRIP_1;
    const expectedResponse: Trip = DEFAULT_TRIP_1;
    let serviceResponse!: Trip;

    service.createTrip(DEFAULT_TRIP_1).subscribe((trip: Trip) => {
      serviceResponse = trip;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('POST');
    expect(serviceResponse).toEqual(expectedResponse);
  }));

  // updateTrip

  it('updating trip works', fakeAsync(() => {
    const mockData: Trip = DEFAULT_TRIP_1;
    const expectedResponse: Trip = DEFAULT_TRIP_1;
    let serviceResponse!: Trip;

    service.updateTrip(DEFAULT_TRIP_1).subscribe((trip: Trip) => {
      serviceResponse = trip;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}/${DEFAULT_TRIP_1._id}`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('PUT');
    expect(serviceResponse).toEqual(expectedResponse);
  }));

  // deleteTrip

  it('deleting trip works', fakeAsync(() => {
    const mockData: Trip = DEFAULT_TRIP_1;
    const expectedResponse: Trip = DEFAULT_TRIP_1;
    let serviceResponse!: Trip;

    service.removeTrip(DEFAULT_TRIP_1).subscribe((trip: Trip) => {
      serviceResponse = trip;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}/${DEFAULT_TRIP_1._id}`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('DELETE');
    expect(serviceResponse).toEqual(expectedResponse);
  }));

  // trip items

  // createTripItem

  it('creating trip item works', fakeAsync(() => {
    const mockData: Trip = { ...DEFAULT_TRIP_1, items: [DEFAULT_TRIP_ITEM_1] };
    const expectedResponse: Trip = { ...DEFAULT_TRIP_1, items: [DEFAULT_TRIP_ITEM_1] };
    let serviceResponse!: Trip;

    service.createTripItem(DEFAULT_TRIP_1, DEFAULT_TRIP_ITEM_1).subscribe((trip: Trip) => {
      serviceResponse = trip;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}/${DEFAULT_TRIP_1._id}/item`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('POST');
    expect(serviceResponse).toEqual(expectedResponse);
  }));

  // checkTripItem

  it('checking trip item works', fakeAsync(() => {
    const mockData: Trip = { ...DEFAULT_TRIP_1, items: [{ ...DEFAULT_TRIP_ITEM_1, checked: true }] };
    const expectedResponse: Trip = { ...DEFAULT_TRIP_1, items: [{ ...DEFAULT_TRIP_ITEM_1, checked: true }] };
    let serviceResponse!: Trip;

    service.checkTripItem(DEFAULT_TRIP_1, DEFAULT_TRIP_ITEM_1).subscribe((trip: Trip) => {
      serviceResponse = trip;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}/${DEFAULT_TRIP_1._id}/item/${DEFAULT_TRIP_ITEM_1._id}`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('PUT');
    expect(serviceResponse).toEqual(expectedResponse);
  }));

  // removeTripItem

  it('removing trip item works', fakeAsync(() => {
    const mockData: Trip = { ...DEFAULT_TRIP_1, items: [] };
    const expectedResponse: Trip = { ...DEFAULT_TRIP_1, items: [] };
    let serviceResponse!: Trip;

    service.removeTripItem(DEFAULT_TRIP_1, DEFAULT_TRIP_ITEM_1).subscribe((trip: Trip) => {
      serviceResponse = trip;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}/${DEFAULT_TRIP_1._id}/item/${DEFAULT_TRIP_ITEM_1._id}`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('DELETE');
    expect(serviceResponse).toEqual(expectedResponse);
  }));
});
