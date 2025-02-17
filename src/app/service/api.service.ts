import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }


  apiURL = 'http://127.0.0.1:8000/api'

  constructor(private http: HttpClient) { }

  getUsuarios():Observable<any> {
    return this.http.get(this.apiURL+'/lista_usuarios').pipe(
      retry(3));
  }

  getViajes(): Observable<any> {
    return this.http.get(this.apiURL+'/lista_viajes').pipe(
      retry(3));
  }

  getViaje(_id: string): Observable<any> {
    return this.http.get(this.apiURL + '/lista_viajes/' + _id).pipe(
      retry(3));
  }

  createViaje(viaje: any): Observable<any>{
    return this.http.post(this.apiURL+'/lista_viajes',viaje, this.httpOptions).pipe(
      retry(3),
      catchError(this.handleError)
      );
  }


  updateViaje(viaje: any): Observable<any>{
    return this.http.put(this.apiURL+'/lista_viajes/'+viaje._id, viaje, this.httpOptions).pipe(
      retry(3),
      catchError(this.handleError)
      );
  }
  
  deleteViaje(id: string): Observable<any>{
    return this.http.delete(this.apiURL+'/lista_viajes/'+id, this.httpOptions).pipe(
      retry(3),
      catchError(this.handleError)
      );
  }

  // Función para manejar errores
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('An error occurred:', error.error.message);
    } else {
      // El servidor devolvió un código de estado 4xx o 5xx
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    // Retorna un observable con un mensaje de error al componente
    return throwError('Algo malo ocurrió; porfavor, intente más tade.');
  }

}
