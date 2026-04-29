import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:3000/api/auth';

    // guardo el usuario en memoria después lo obtengo con getMe() para no hacer una petición cada vez que quiera saber quién es el usuario logeado
  private currentUser: any = null;

  constructor(private http: HttpClient) {}

  // 🔐 LOGIN
  login(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/login`,
      { email, password },
      { withCredentials: true }
    );
  }

  // obtener usuario logeado desde backend (debajo de login)
  getMe(): Observable<any> {
    return this.http.get(
      `${this.API_URL}/me`,
      { withCredentials: true }
    );
  }

// guardo usuario en memoria
  setUser(user: any) {
    this.currentUser = user;
  }
  // obtengo usuario desde memoria
  getUser() {
    return this.currentUser;
  }

  logout(): Observable<any> {
  return this.http.post(
    `${this.API_URL}/logout`,
    {},
    { withCredentials: true }
  );
}
}