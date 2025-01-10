import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DEFAULT_SETTINGS } from '../constants/settings.constants';
import { Settings } from '../models/settings.model';

import {
  DEFAULT_MOCK_SETTINGS_0,
  DEFAULT_MOCK_SETTINGS_1,
  DEFAULT_MOCK_SETTINGS_ID_0,
} from '../../common/mocks/settings.constants';

import { environment } from '../../../environments/environment';

import { SettingsHttpService } from './settings-http.service';

describe('SettingsHttpService', () => {
  let httpMock: HttpTestingController;
  let service: SettingsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), SettingsHttpService],
      teardown: { destroyAfterEach: false },
    });

    // clear localStorage before every test to have known state
    localStorage.clear();

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SettingsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // getSettings

  describe('getSettings()', () => {
    it('getting settings when Settings ID is not available in localStorage works', fakeAsync(() => {
      const mockData: Settings = DEFAULT_MOCK_SETTINGS_1;
      const expectedResponse: Settings = DEFAULT_MOCK_SETTINGS_1;
      let serviceResponse!: Settings;

      service.getSettings().subscribe((settings: Settings) => {
        serviceResponse = settings;
      });

      const req = httpMock.expectOne(`${environment.settingsApi}`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
    }));

    it('getting settings when Settings ID is available in localStorage works', fakeAsync(() => {
      localStorage.setItem('to-settings-id', DEFAULT_MOCK_SETTINGS_ID_0);

      const mockData: Settings = DEFAULT_MOCK_SETTINGS_0;
      const expectedResponse: Settings = DEFAULT_MOCK_SETTINGS_0;
      let serviceResponse!: Settings;

      service.getSettings().subscribe((settings: Settings) => {
        serviceResponse = settings;
      });

      const req = httpMock.expectOne(`${environment.settingsApi}/${DEFAULT_MOCK_SETTINGS_ID_0}`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
    }));

    it('getting settings returns Default Settings when HTTP Error is thrown', fakeAsync(() => {
      const mockData = new ErrorEvent('Invalid Request', {
        error: new HttpErrorResponse({
          error: { code: `Invalid Request`, message: `Invalid Request` },
          status: 400,
          statusText: 'Bad Request',
        }),
      });
      const expectedResponse: Settings = DEFAULT_SETTINGS;
      let serviceResponse!: Settings;

      service.getSettings().subscribe((settings: Settings) => {
        serviceResponse = settings;
      });

      const req = httpMock.expectOne(`${environment.settingsApi}`);
      req.error(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  // updateSettings

  describe('updateSettings()', () => {
    it('update settings when Settings ID is not available in localStorage works', fakeAsync(() => {
      const mockData: Settings = DEFAULT_MOCK_SETTINGS_0;
      const expectedResponse: Settings = DEFAULT_MOCK_SETTINGS_0;
      let serviceResponse!: Settings;

      service.updateSettings(DEFAULT_MOCK_SETTINGS_1).subscribe((settings: Settings) => {
        serviceResponse = settings;
      });

      const req = httpMock.expectOne(`${environment.settingsApi}`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('POST');
      expect(serviceResponse).toEqual(expectedResponse);
    }));

    it('update settings when Settings ID is available in localStorage works', fakeAsync(() => {
      localStorage.setItem('to-settings-id', DEFAULT_MOCK_SETTINGS_ID_0);

      const mockData: Settings = DEFAULT_MOCK_SETTINGS_0;
      const expectedResponse: Settings = DEFAULT_MOCK_SETTINGS_0;
      let serviceResponse!: Settings;

      service.updateSettings(DEFAULT_MOCK_SETTINGS_0).subscribe((settings: Settings) => {
        serviceResponse = settings;
      });

      const req = httpMock.expectOne(`${environment.settingsApi}/${DEFAULT_MOCK_SETTINGS_ID_0}`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('PUT');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });
});
