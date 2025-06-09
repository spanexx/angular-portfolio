import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private currentViewSubject = new BehaviorSubject<string>('portfolio');
  currentView$ = this.currentViewSubject.asObservable();

  private loadingStateSubject = new BehaviorSubject<boolean>(false);
  loadingState$ = this.loadingStateSubject.asObservable();

  private userPreferencesSubject = new BehaviorSubject<any>({});
  userPreferences$ = this.userPreferencesSubject.asObservable();

  constructor() { }

  setCurrentView(view: string): void {
    this.currentViewSubject.next(view);
  }

  setLoadingState(loading: boolean): void {
    this.loadingStateSubject.next(loading);
  }

  setUserPreferences(preferences: any): void {
    this.userPreferencesSubject.next(preferences);
  }
}
