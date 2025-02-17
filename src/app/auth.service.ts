import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private username: string = '';
  private apiUrl: string = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  setUsername(username: string) {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }

  
  login(email: string, password: string) {
    // Realiza una solicitud GET a la API de Django para validar el inicio de sesión
    const url = `${this.apiUrl}validar-usuario/?email=${email}&password=${password}`;
    return this.http.get(url);
  }
  
  // Método para actualizar la contraseña
  updatePassword(newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/actualizar-usuario/${this.username}/`; 
    const body = { contrasennia: newPassword }; 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put(url, body, { headers });
  }



}
