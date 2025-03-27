import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MOCK_AUTH_TOKEN_1 } from '../../../../__mocks__/constants/auth.constants';

import { AuthService } from '../services/auth.service';

import { authInterceptor } from './auth.interceptor';

import { environment } from '../../../environments/environment';

describe('authInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  let authService: AuthService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(), AuthService],
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  // auth token

  it('should not add auth Authorization header with Access Token to URL on excluded list', () => {
    const getAuthToken = jest.spyOn(authService, 'getAuthToken').mockReturnValue(MOCK_AUTH_TOKEN_1);

    const url = `${environment.authApi}/auth/login`;
    httpClient.post(url, {}).subscribe();

    const req = httpTestingController.expectOne(url);
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(getAuthToken).toHaveBeenCalledTimes(0);
  });

  it('should add auth Authorization header with Access Token to URL not on excluded list', () => {
    const getAuthToken = jest.spyOn(authService, 'getAuthToken').mockReturnValue(MOCK_AUTH_TOKEN_1);

    const url = `${environment.authApi}/settings`;
    httpClient.get(url).subscribe();

    const req = httpTestingController.expectOne(url);
    expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${authService.getAuthToken().accessToken}`);
    expect(getAuthToken).toHaveBeenCalled();
  });
});
