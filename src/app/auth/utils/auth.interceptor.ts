import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

interface ExcludedUrl {
  url: string;
  method: string;
}

function isExcludedUrl(url: string, method: string): boolean {
  const excludedUrls: ExcludedUrl[] = [
    {
      url: '.json',
      method: 'GET',
    },
    {
      url: '/auth/login',
      method: 'POST',
    },
    {
      url: '/auth/signup',
      method: 'POST',
    },
    // {
    //   url: '/settings',
    //   method: 'GET',
    // },
  ];

  return (
    excludedUrls.filter((excludedUrl: ExcludedUrl) => {
      return url.includes(excludedUrl.url) && method === excludedUrl.method;
    }).length > 0
  );
}

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  if (isExcludedUrl(request.url, request.method)) {
    return next(request);
  }

  const authToken = inject(AuthService).getAuthToken();

  if (authToken && authToken.accessToken) {
    request = request.clone({
      headers: request.headers.append('Authorization', `Bearer ${authToken.accessToken}`),
    });
  }

  return next(request);
};
