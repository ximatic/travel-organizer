/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, of } from 'rxjs';

export const messageServiceMock: { add: jest.Mock; messageObserver: Observable<any>; clearObserver: Observable<any> } = {
  add: jest.fn(),
  messageObserver: of(null),
  clearObserver: of(null),
};
