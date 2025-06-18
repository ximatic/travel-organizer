export const TripsServiceMock = {
  loadTrips: jest.fn(),
  loadTrip: jest.fn(),
  createTrip: jest.fn(),
  updateTrip: jest.fn(),
  removeTrip: jest.fn(),

  createTripItem: jest.fn(),
  checkTripItem: jest.fn(),
  removeTripItem: jest.fn(),
};
