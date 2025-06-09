import { Injectable, inject, ErrorHandler } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';
import { LoadingService } from '../../services/loading.service';
import { GlobalErrorHandler } from '../../services/error-handler.service';

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class HttpDataService {

  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);
  private errorHandler = inject(GlobalErrorHandler);

  private cache$?: Observable<any>;

  constructor() { }

  /**
   * Demonstrates how to use caching, error handling, and loading indicators.
   * In a real-world scenario, you would replace 'your-api-endpoint' with your actual API endpoint
   * and adjust the response type accordingly.
   */
  getData(): Observable<any> {
    if (!this.cache$) {
      this.cache$ = this.http.get('your-api-endpoint').pipe(
        tap(() => this.loadingService.show()),
        shareReplay(CACHE_SIZE),
        catchError((error: any) => {
          this.loadingService.hide();
          return throwError(() => this.errorHandler.handleError(error));
        }),
        tap(() => this.loadingService.hide())
      );
    }
    return this.cache$;
  }

  // Clear the cache, forcing a fresh request next time.
  clearCache() {
    this.cache$ = undefined;
  }
}
