import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { requestFormatInterceptor } from './interceptors/request-format.interceptor';
import { loggingInterceptor } from './interceptors/logging.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        requestFormatInterceptor,
        authInterceptor,
        loggingInterceptor,
        errorInterceptor
      ])
    )
  ]
};
