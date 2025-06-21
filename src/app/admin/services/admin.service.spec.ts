import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AdminUser, CreateAdminUserPayload, UpdateAdminUserPayload } from '../models/admin-user.model';

import { MOCK_ADMIN_USER_1, MOCK_ADMIN_USER_2 } from '../../../../__mocks__/constants/admin.constants';
import { MOCK_PASSWORD_1 } from '../../../../__mocks__/constants/auth.constants';
import { MOCK_USER_ID_1 } from '../../../../__mocks__/constants/common.constants';

import { environment } from '../../../environments/environment';

import { AdminService } from './admin.service';

describe('AdminService', () => {
  let httpMock: HttpTestingController;
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AdminService],
      teardown: { destroyAfterEach: false },
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // users

  // loadUsers

  describe('loadUsers', () => {
    it('loading users with empty result works', fakeAsync(() => {
      const mockData: AdminUser[] = [];
      const expectedResponse: AdminUser[] = [];
      let serviceResponse!: AdminUser[];

      service.loadUsers().subscribe((result: AdminUser[]) => {
        serviceResponse = result;
      });

      const req = httpMock.expectOne(`${environment.userAdminApi}`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
    }));

    it('loading users with non-empty result works', fakeAsync(() => {
      const mockData: AdminUser[] = [MOCK_ADMIN_USER_1, MOCK_ADMIN_USER_2];
      const expectedResponse: AdminUser[] = [MOCK_ADMIN_USER_1, MOCK_ADMIN_USER_2];
      let serviceResponse!: AdminUser[];

      service.loadUsers().subscribe((result: AdminUser[]) => {
        serviceResponse = result;
      });

      const req = httpMock.expectOne(`${environment.userAdminApi}`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  // loadUser

  describe('loadUser', () => {
    it('loading user with non-empty result works', fakeAsync(() => {
      const mockData: AdminUser = MOCK_ADMIN_USER_1;
      const expectedResponse: AdminUser = MOCK_ADMIN_USER_1;
      let serviceResponse!: AdminUser;

      service.loadUser(MOCK_ADMIN_USER_1.id as string).subscribe((result: AdminUser) => {
        serviceResponse = result;
      });

      const req = httpMock.expectOne(`${environment.userAdminApi}/${MOCK_ADMIN_USER_1.id}`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  // createUser

  describe('createUser', () => {
    it('creating user works', fakeAsync(() => {
      const mockData: AdminUser = MOCK_ADMIN_USER_1;
      const expectedResponse: AdminUser = MOCK_ADMIN_USER_1;
      let serviceResponse!: AdminUser;

      const payload: CreateAdminUserPayload = {
        ...MOCK_ADMIN_USER_1,
        password: MOCK_PASSWORD_1,
        passwordRepeat: MOCK_PASSWORD_1,
      };

      service.createUser(payload).subscribe((result: AdminUser) => {
        serviceResponse = result;
      });

      const req = httpMock.expectOne(`${environment.userAdminApi}`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('POST');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  // updateUser

  describe('updateUser', () => {
    it('updating user works', fakeAsync(() => {
      const mockData: AdminUser = MOCK_ADMIN_USER_1;
      const expectedResponse: AdminUser = MOCK_ADMIN_USER_1;
      let serviceResponse!: AdminUser;

      const payload: UpdateAdminUserPayload = {
        id: MOCK_USER_ID_1,
        ...MOCK_ADMIN_USER_1,
      };

      service.updateUser(MOCK_USER_ID_1, payload).subscribe((result: AdminUser) => {
        serviceResponse = result;
      });

      const req = httpMock.expectOne(`${environment.userAdminApi}/${MOCK_ADMIN_USER_1.id}`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('PUT');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  // deleteUser

  describe('deleteUser', () => {
    it('deleting user works', fakeAsync(() => {
      service.deleteUser(MOCK_USER_ID_1).subscribe();

      const req = httpMock.expectOne(`${environment.userAdminApi}/${MOCK_USER_ID_1}`);
      req.flush({});

      tick();

      expect(req.request.method).toEqual('DELETE');
    }));
  });
});
