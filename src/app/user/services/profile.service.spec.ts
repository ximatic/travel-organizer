import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UserProfile } from '../models/user.model';

import { DEFAULT_USER_PROFILE_1, DEFAULT_USER_PROFILE_2 } from '../../common/mocks/user.constants';

import { environment } from '../../../environments/environment';

import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let httpMock: HttpTestingController;
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ProfileService],
      teardown: { destroyAfterEach: false },
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // loadProfile

  describe('loadProfile()', () => {
    it('loading profile works', fakeAsync(() => {
      const mockData: UserProfile = DEFAULT_USER_PROFILE_1;
      const expectedResponse: UserProfile = DEFAULT_USER_PROFILE_1;
      let serviceResponse!: UserProfile;

      service.loadProfile().subscribe((profile: UserProfile) => {
        serviceResponse = profile;
      });

      const req = httpMock.expectOne(`${environment.authApi}/profile`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  // updateProfile

  describe('updateProfile()', () => {
    it('update profile works', fakeAsync(() => {
      const mockData: UserProfile = DEFAULT_USER_PROFILE_2;
      const expectedResponse: UserProfile = DEFAULT_USER_PROFILE_2;
      let serviceResponse!: UserProfile;

      service.updateProfile(DEFAULT_USER_PROFILE_2).subscribe((profile: UserProfile) => {
        serviceResponse = profile;
      });

      const req = httpMock.expectOne(`${environment.authApi}/profile`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('PUT');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });
});
