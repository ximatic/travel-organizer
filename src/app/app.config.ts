import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';

const AppPrimeNGPreset = definePreset(Aura, {
  components: {
    toolbar: {
      border: {
        radius: '5rem',
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: AppPrimeNGPreset,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    }),
    // providePrimeNG({
    //   theme: {
    //     preset: Aura,
    //     options: {
    //       darkModeSelector: '.dark-mode',
    //     },
    //   },
    // }),
  ],
};
