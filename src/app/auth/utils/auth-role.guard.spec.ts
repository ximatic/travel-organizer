/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { jwtDecode } from 'jwt-decode';

import {
  MOCK_AUTH_TOKEN_0,
  MOCK_AUTH_TOKEN_1,
  MOCK_AUTH_TOKEN_2,
  MOCK_INITIAL_AUTH_STATE,
} from '../../../../__mocks__/constants/auth.constants';

import { selectAuthToken } from '../store/auth.selectors';

import { AuthRoleGuard } from './auth-role.guard';

describe('AuthRoleGuard', () => {
  let guard: AuthRoleGuard;
  let router: Router;
  let store: MockStore;

  let mockAuthTokenSelector: any;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideMockStore({ initialState: MOCK_INITIAL_AUTH_STATE }), AuthRoleGuard],
    });

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);

    mockAuthTokenSelector = store.overrideSelector(selectAuthToken, null);
  });

  beforeEach(() => {
    guard = TestBed.inject(AuthRoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('handling null Auth Token works', (done) => {
    const spyNavigate = jest.spyOn(router, 'navigate');

    mockAuthTokenSelector.setResult(null);

    store.refreshState();

    guard.canActivate().subscribe((result: boolean) => {
      expect(result).toBeFalsy();
      expect(spyNavigate).toHaveBeenCalledWith([`/auth/login`]);
      done();
    });
  });

  it('handling Auth Token with null Role works', (done) => {
    const spyNavigate = jest.spyOn(router, 'navigate');
    //jest.spyOn(jwtDecode).mockImplementation(() => false);

    mockAuthTokenSelector.setResult(MOCK_AUTH_TOKEN_0);

    store.refreshState();

    guard.canActivate().subscribe((result: boolean) => {
      expect(result).toBeFalsy();
      expect(spyNavigate).toHaveBeenCalledWith([`/auth/login`]);
      done();
    });
  });

  it('handling Auth Token with User Role works', (done) => {
    const spyNavigate = jest.spyOn(router, 'navigate');

    mockAuthTokenSelector.setResult(MOCK_AUTH_TOKEN_1);

    store.refreshState();

    guard.canActivate().subscribe((result: boolean) => {
      expect(result).toBeFalsy();
      expect(spyNavigate).toHaveBeenCalledWith([`/dashboard`]);
      done();
    });
  });

  it('handling Auth Token with Admin Role works', (done) => {
    const spyNavigate = jest.spyOn(router, 'navigate');

    mockAuthTokenSelector.setResult(MOCK_AUTH_TOKEN_2);

    store.refreshState();

    guard.canActivate().subscribe((result: any) => {
      expect(result).toBeTruthy();
      expect(spyNavigate).toHaveBeenCalledTimes(0);
      done();
    });
  });
});
