import { TestBed } from '@angular/core/testing';

import { switchMap } from 'rxjs';

import { DEFAULT_SETTINGS } from '../constants/settings.constants';
import { Settings } from '../models/settings.model';

import { DEFAULT_MOCK_SETTINGS_2 } from '../../common/mocks/settings.constants';

import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    // clear localStorage before every test to have known state
    localStorage.clear();

    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // loadSettings

  it('no settings initially in localStorage', (done) => {
    service.loadSettings().subscribe((settings: Settings) => {
      expect(settings).toEqual(DEFAULT_SETTINGS);
      done();
    });
  });

  // updateSettings

  it('updating trip works', (done) => {
    const updatedSettings: Settings = {
      ...DEFAULT_MOCK_SETTINGS_2,
    };

    service
      .updateSettings(updatedSettings)
      .pipe(switchMap(() => service.loadSettings()))
      .subscribe((settings: Settings) => {
        expect(settings).toEqual(DEFAULT_MOCK_SETTINGS_2);
        done();
      });
  });
});
