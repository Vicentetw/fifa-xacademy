import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  // 🔐 LOGIN
  login(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/login`,
      { email, password },
      { withCredentials: true }
    );
  }

  // 👇 AGREGAR JUSTO ACÁ (debajo de login)
  getMe(): Observable<any> {
    return this.http.get(
      `${this.API_URL}/me`,
      { withCredentials: true }
    );
  }

  logout(): Observable<any> {
  return this.http.post(
    `${this.API_URL}/logout`,
    {},
    { withCredentials: true }
  );
}
}