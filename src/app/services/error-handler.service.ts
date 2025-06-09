import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global Error Handler caught an error:', error);
    // Here you could add more sophisticated error handling logic,
    // such as sending errors to a logging service, showing a user-friendly message, etc.
  }
}