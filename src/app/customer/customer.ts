import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface CustomerResponse {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly base = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  create(request: CustomerRequest): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(this.base, request);
  }

  getById(id: number): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.base}/${id}`);
  }

  getAll(): Observable<CustomerResponse[]> {
    return this.http.get<CustomerResponse[]>(this.base);
  }

  update(id: number, request: CustomerRequest): Observable<CustomerResponse> {
    return this.http.put<CustomerResponse>(`${this.base}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  searchByPhone(phoneNumber: string): Observable<CustomerResponse> {
    const params = new HttpParams().set('phoneNumber', phoneNumber);
    return this.http.get<CustomerResponse>(`${this.base}/search`, { params });
  }
}





