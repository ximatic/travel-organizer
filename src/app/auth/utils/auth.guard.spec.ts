/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { MOCK_AUTH_TOKEN_1, MOCK_INITIAL_AUTH_STATE } from '../../../../__mocks__/constants/auth.constants';

import { selectAuthToken } from '../store/auth.selectors';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let store: MockStore;

  let mockAuthTokenSelector: any;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideMockStore({ initialState: MOCK_INITIAL_AUTH_STATE }), AuthGuard],
    });

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);

    mockAuthTokenSelector = store.overrideSelector(selectAuthToken, null);
  });

  beforeEach(() => {
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // auth token

  describe('canActivate()', () => {
    it('handling null Auth Token works', (done) => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      mockAuthTokenSelector.setResult(null);

      store.refreshState();

      guard.canActivate().subscribe((result: any) => {
        expect(result).toBeFalsy();
        expect(navigateSpy).toHaveBeenCalledWith([`/auth/login`]);
        done();
      });
    });

    it('handling exisiting Auth Token works', (done) => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      mockAuthTokenSelector.setResult(MOCK_AUTH_TOKEN_1);

      store.refreshState();

      guard.canActivate().subscribe((result: any) => {
        expect(result).toBeTruthy();
        expect(navigateSpy).toHaveBeenCalledTimes(0);
        done();
      });
    });
  });
});
