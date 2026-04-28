import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createUser(user: {
    name: string;
    username: string;
    password: string;
    role: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/users`, user);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.API_URL}/users`);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/${id}`);
  }
}
