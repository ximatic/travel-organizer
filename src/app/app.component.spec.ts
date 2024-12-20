import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideMockStore } from '@ngrx/store/testing';

import { DEFAULT_INITIAL_SETTINGS_STATE } from './common/mocks/settings.constants';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideMockStore({ initialState: DEFAULT_INITIAL_SETTINGS_STATE })],
    }).compileComponents();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
