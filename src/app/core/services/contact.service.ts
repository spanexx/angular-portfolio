import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactInfo } from '../../shared/models/contact-info.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiService = inject(ApiService);

  /**
   * Get contact information
   */
  getContactInfo(): Observable<ContactInfo> {
    return this.apiService.get<ContactInfo>('contact');
  }

  /**
   * Update contact information
   */
  updateContactInfo(contact: Partial<ContactInfo>): Observable<ContactInfo> {
    return this.apiService.put<ContactInfo>('contact', contact);
  }
}