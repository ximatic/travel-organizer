import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { MOCK_INITIAL_USER_STATE } from '../../__mocks__/user.constants';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideTranslateService(), provideMockStore({ initialState: MOCK_INITIAL_USER_STATE })],
    }).compileComponents();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
