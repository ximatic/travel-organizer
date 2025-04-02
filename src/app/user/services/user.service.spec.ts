import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MOCK_USER_DATA_1, MOCK_USER_PASSWORD_1 } from '../../../../__mocks__/constants/user-profile.constants';
import { MOCK_USER_INFO_1 } from '../../../../__mocks__/constants/user.constants';

import { UserData, UserInfo } from '../models/user.model';

import { environment } from '../../../environments/environment';

import { UserService } from './user.service';

describe('UserService', () => {
  let httpMock: HttpTestingController;
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), UserService],
      teardown: { destroyAfterEach: false },
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // loadUserInfo

  describe('loadUserInfo()', () => {
    it('loading user info works', fakeAsync(() => {
      const mockData: UserInfo = MOCK_USER_INFO_1;
      const expectedResponse: UserInfo = MOCK_USER_INFO_1;
      let serviceResponse!: UserInfo;

      service.loadUserInfo().subscribe((userInfo: UserInfo) => {
        serviceResponse = userInfo;
      });

      const req = httpMock.expectOne(`${environment.userApi}/info`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  // updateUserData

  describe('updateUserData()', () => {
    it('update user data works', fakeAsync(() => {
      const mockData: UserData = MOCK_USER_DATA_1;
      const expectedResponse: UserData = MOCK_USER_DATA_1;
      let serviceResponse!: UserData;

      service.updateUserData(MOCK_USER_DATA_1).subscribe((userData: UserData) => {
        serviceResponse = userData;
      });

      const req = httpMock.expectOne(`${environment.userApi}/data`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('PUT');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  // updateUserPassword

  describe('updateUserPassword()', () => {
    it('update user password works', fakeAsync(() => {
      service.updateUserPassword(MOCK_USER_PASSWORD_1).subscribe();

      const req = httpMock.expectOne(`${environment.userApi}/password`);
      req.flush({});

      tick();

      expect(req.request.method).toEqual('PUT');
    }));
  });
});
