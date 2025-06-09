import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Placeholder guard - always returns true
  console.log('AuthGuard activated');
  return true;
};