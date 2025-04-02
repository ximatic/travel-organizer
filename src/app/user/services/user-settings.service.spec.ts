import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MOCK_USER_SETTINGS_1, MOCK_USER_SETTINGS_2 } from '../../../../__mocks__/constants/user-settings.constants';

import { DEFAULT_USER_SETTINGS } from '../constants/settings.constants';
import { UserSettings } from '../models/user-settings.model';

import { environment } from '../../../environments/environment';

import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
  let httpMock: HttpTestingController;
  let service: UserSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), UserSettingsService],
      teardown: { destroyAfterEach: false },
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UserSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // getSettings

  describe('loadSettings()', () => {
    it('loading settings works', fakeAsync(() => {
      const mockData: UserSettings = MOCK_USER_SETTINGS_1;
      const expectedResponse: UserSettings = MOCK_USER_SETTINGS_1;
      let serviceResponse!: UserSettings;

      service.loadSettings().subscribe((userSettings: UserSettings) => {
        serviceResponse = userSettings;
      });

      const req = httpMock.expectOne(`${environment.userApi}/settings`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
    }));

    it('loading settings returns Default Settings when HTTP Error is thrown', fakeAsync(() => {
      const mockData = new ErrorEvent('Invalid Request', {
        error: new HttpErrorResponse({
          error: { code: `Invalid Request`, message: `Invalid Request` },
          status: 400,
          statusText: 'Bad Request',
        }),
      });
      const expectedResponse: UserSettings = DEFAULT_USER_SETTINGS;
      let serviceResponse!: UserSettings;

      service.loadSettings().subscribe((settings: UserSettings) => {
        serviceResponse = settings;
      });

      const req = httpMock.expectOne(`${environment.userApi}/settings`);
      req.error(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  // updateSettings

  describe('updateSettings()', () => {
    it('update settings when Settings ID is not available in localStorage works', fakeAsync(() => {
      const mockData: UserSettings = MOCK_USER_SETTINGS_2;
      const expectedResponse: UserSettings = MOCK_USER_SETTINGS_2;
      let serviceResponse!: UserSettings;

      service.updateSettings(MOCK_USER_SETTINGS_2).subscribe((settings: UserSettings) => {
        serviceResponse = settings;
      });

      const req = httpMock.expectOne(`${environment.userApi}/settings`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('PUT');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });
});
