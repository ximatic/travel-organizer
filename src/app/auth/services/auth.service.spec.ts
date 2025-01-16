import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import {
  DEFAULT_AUTH_TOKEN_1,
  DEFAULT_EMAIL_1,
  DEFAULT_FIRSTNAME_1,
  DEFAULT_LASTNAME_1,
  DEFAULT_PASSWORD_1,
} from '../../common/mocks/auth.constants';
import { AuthToken, SignupPayload } from '../model/auth.model';

import { environment } from '../../../environments/environment';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let httpMock: HttpTestingController;
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService],
      teardown: { destroyAfterEach: false },
    });

    // clear localStorage before every test to have known state
    localStorage.clear();

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // login

  describe('login()', () => {
    it('login works', fakeAsync(() => {
      const mockData: AuthToken = DEFAULT_AUTH_TOKEN_1;
      const expectedResponse: AuthToken = DEFAULT_AUTH_TOKEN_1;
      let serviceResponse!: AuthToken;

      service.login(DEFAULT_EMAIL_1, DEFAULT_PASSWORD_1).subscribe((authToken: AuthToken) => {
        serviceResponse = authToken;
      });

      const req = httpMock.expectOne(`${environment.authApi}/login`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('POST');
      expect(serviceResponse).toEqual(expectedResponse);
      expect(service.getAuthToken()).toEqual(DEFAULT_AUTH_TOKEN_1);
    }));
  });

  describe('logout()', () => {
    it('logout works', fakeAsync(() => {
      service.logout().subscribe();

      const req = httpMock.expectOne(`${environment.authApi}/logout`);
      req.flush('');

      tick();

      expect(req.request.method).toEqual('GET');
      expect(service.getAuthToken()).toEqual({});
    }));
  });

  // verify

  describe('verify()', () => {
    it('verify works', fakeAsync(() => {
      const mockData: AuthToken = DEFAULT_AUTH_TOKEN_1;
      const expectedResponse: AuthToken = DEFAULT_AUTH_TOKEN_1;
      let serviceResponse!: AuthToken;

      service.verify().subscribe((authToken: AuthToken) => {
        serviceResponse = authToken;
      });

      const req = httpMock.expectOne(`${environment.authApi}/verify`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
      expect(service.getAuthToken()).toEqual(DEFAULT_AUTH_TOKEN_1);
    }));
  });

  // signup

  describe('signup()', () => {
    it('signup works', fakeAsync(() => {
      const mockData: AuthToken = DEFAULT_AUTH_TOKEN_1;
      const expectedResponse: AuthToken = DEFAULT_AUTH_TOKEN_1;
      let serviceResponse!: AuthToken;

      const payload: SignupPayload = {
        email: DEFAULT_EMAIL_1,
        password: DEFAULT_PASSWORD_1,
        passwordRepeat: DEFAULT_PASSWORD_1,
        firstname: DEFAULT_FIRSTNAME_1,
        lastname: DEFAULT_LASTNAME_1,
      };
      service.signup(payload).subscribe((authToken: AuthToken) => {
        serviceResponse = authToken;
      });

      const req = httpMock.expectOne(`${environment.authApi}/signup`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('POST');
      expect(serviceResponse).toEqual(expectedResponse);
      expect(service.getAuthToken()).toEqual(DEFAULT_AUTH_TOKEN_1);
    }));
  });
});
