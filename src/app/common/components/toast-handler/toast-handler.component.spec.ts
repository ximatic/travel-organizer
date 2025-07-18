import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { provideTranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

import { messageServiceMock } from '../../../../../__mocks__/services.mocks';

import { ToastHandlerComponent } from './toast-handler.component';

describe('ToastHandlerComponent', () => {
  let component: ToastHandlerComponent;
  let fixture: ComponentFixture<ToastHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastHandlerComponent],
      providers: [provideNoopAnimations(), provideTranslateService(), MessageService],
    }).compileComponents();
    TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastHandlerComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
