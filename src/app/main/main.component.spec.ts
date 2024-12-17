import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('toggleSidebar works', () => {
    expect(component.sidebarVisible).toBeFalsy();
    component.toggleSidebar();
    expect(component.sidebarVisible).toBeTruthy();
    component.toggleSidebar();
    expect(component.sidebarVisible).toBeFalsy();
  });

  it('toggleDarkMode works', () => {
    const htmlElement = document.querySelector('html');
    const className = 'dark-mode';
    expect(htmlElement?.classList.contains(className)).toBeFalsy();
    component.toggleDarkMode();
    expect(htmlElement?.classList.contains(className)).toBeTruthy();
    component.toggleDarkMode();
    expect(htmlElement?.classList.contains(className)).toBeFalsy();
  });
});
