import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Trip } from '../models/trip.model';

import { MOCK_TRIP_1, MOCK_TRIP_2, MOCK_TRIP_ITEM_1 } from '../../../../__mocks__/constants/trips.constants';

import { TripsService } from './trips.service';
import { environment } from '../../../environments/environment';

describe('TripsService', () => {
  let httpMock: HttpTestingController;
  let service: TripsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), TripsService],
      teardown: { destroyAfterEach: false },
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TripsService);
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
    const mockData: Trip[] = [MOCK_TRIP_1, MOCK_TRIP_2];
    const expectedResponse: Trip[] = [MOCK_TRIP_1, MOCK_TRIP_2];
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
    const mockData: Trip = MOCK_TRIP_1;
    const expectedResponse: Trip = MOCK_TRIP_1;
    let serviceResponse!: Trip;

    service.loadTrip(MOCK_TRIP_1._id as string).subscribe((trip: Trip) => {
      serviceResponse = trip;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}/${MOCK_TRIP_1._id}`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('GET');
    expect(serviceResponse).toEqual(expectedResponse);
  }));

  // createTrip

  it('creating trip works', fakeAsync(() => {
    const mockData: Trip = MOCK_TRIP_1;
    const expectedResponse: Trip = MOCK_TRIP_1;
    let serviceResponse!: Trip;

    service.createTrip(MOCK_TRIP_1).subscribe((trip: Trip) => {
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
    const mockData: Trip = MOCK_TRIP_1;
    const expectedResponse: Trip = MOCK_TRIP_1;
    let serviceResponse!: Trip;

    service.updateTrip(MOCK_TRIP_1).subscribe((trip: Trip) => {
      serviceResponse = trip;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}/${MOCK_TRIP_1._id}`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('PUT');
    expect(serviceResponse).toEqual(expectedResponse);
  }));

  // deleteTrip

  it('deleting trip works', fakeAsync(() => {
    const mockData: Trip = MOCK_TRIP_1;
    const expectedResponse: Trip = MOCK_TRIP_1;
    let serviceResponse!: Trip;

    service.removeTrip(MOCK_TRIP_1).subscribe((trip: Trip) => {
      serviceResponse = trip;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}/${MOCK_TRIP_1._id}`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('DELETE');
    expect(serviceResponse).toEqual(expectedResponse);
  }));

  // trip items

  // createTripItem

  it('creating trip item works', fakeAsync(() => {
    const mockData: Trip = { ...MOCK_TRIP_1, items: [MOCK_TRIP_ITEM_1] };
    const expectedResponse: Trip = { ...MOCK_TRIP_1, items: [MOCK_TRIP_ITEM_1] };
    let serviceResponse!: Trip;

    service.createTripItem(MOCK_TRIP_1, MOCK_TRIP_ITEM_1).subscribe((trip: Trip) => {
      serviceResponse = trip;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}/${MOCK_TRIP_1._id}/item`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('POST');
    expect(serviceResponse).toEqual(expectedResponse);
  }));

  // checkTripItem

  it('checking trip item works', fakeAsync(() => {
    const mockData: Trip = { ...MOCK_TRIP_1, items: [{ ...MOCK_TRIP_ITEM_1, checked: true }] };
    const expectedResponse: Trip = { ...MOCK_TRIP_1, items: [{ ...MOCK_TRIP_ITEM_1, checked: true }] };
    let serviceResponse!: Trip;

    service.checkTripItem(MOCK_TRIP_1, MOCK_TRIP_ITEM_1).subscribe((trip: Trip) => {
      serviceResponse = trip;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}/${MOCK_TRIP_1._id}/item/${MOCK_TRIP_ITEM_1._id}`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('PUT');
    expect(serviceResponse).toEqual(expectedResponse);
  }));

  // removeTripItem

  it('removing trip item works', fakeAsync(() => {
    const mockData: Trip = { ...MOCK_TRIP_1, items: [] };
    const expectedResponse: Trip = { ...MOCK_TRIP_1, items: [] };
    let serviceResponse!: Trip;

    service.removeTripItem(MOCK_TRIP_1, MOCK_TRIP_ITEM_1).subscribe((trip: Trip) => {
      serviceResponse = trip;
    });

    const req = httpMock.expectOne(`${environment.tripsApi}/${MOCK_TRIP_1._id}/item/${MOCK_TRIP_ITEM_1._id}`);
    req.flush(mockData);

    tick();

    expect(req.request.method).toEqual('DELETE');
    expect(serviceResponse).toEqual(expectedResponse);
  }));
});
