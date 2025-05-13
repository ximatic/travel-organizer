/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

import { messageServiceMock } from '../../../../../__mocks__/services.mocks';
import { AdminStoreMock } from '../../../../../__mocks__/stores/admin.store.mock';

import { AdminStore } from '../../store/admin.store';

import { AdminUserComponent } from './admin-users.component';

describe('AdminUserComponent', () => {
  let component: AdminUserComponent;
  let fixture: ComponentFixture<AdminUserComponent>;

  let router: Router;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserComponent],
      providers: [provideRouter([]), provideNoopAnimations(), provideTranslateService(), MessageService, AdminStore],
    }).compileComponents();
    TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });
    TestBed.overrideProvider(AdminStore, { useValue: AdminStoreMock });

    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
