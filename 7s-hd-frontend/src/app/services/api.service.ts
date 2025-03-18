import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ToastController } from '@ionic/angular';
import { SecureStorageService } from './secure-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl; // URL base del backend

  constructor(private http: HttpClient, private toastCtrl: ToastController,
    private storage: SecureStorageService,
    private router: Router
  ) { }

  private async getHeaders(): Promise<HttpHeaders> {
    const token = await this.storage.get('token') || '';
    const idRol = await this.storage.get('idRol') || '';
    const idUsuario = await this.storage.get('idUsuario') || '';

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'idRol': idRol.toString(),
      'idUsuario': idUsuario.toString()
    });
  }

  // // Método genérico para peticiones GET
  // get<T>(endpoint: string, params?: any): Observable<T> {
  //   return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params }).pipe(
  //     catchError(error => this.handleError(error))
  //   );
  // }


  async getSinT<T>(endpoint: string): Promise<Observable<T>> {
    const headers = await this.getHeaders();
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { headers }).pipe(
      catchError((error) => this.handleError<T>(error)) // Asegurar compatibilidad de tipos
    );
  }

  async get<T>(endpoint: string, params?: any): Promise<Observable<T>> {
    const token = await this.storage.get('token'); // Obtener el token almacenado
    console.log('Token obtenido:', token);
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { headers, params }).pipe(
        catchError(error => this.handleError<T>(error))
    );
}

  async post<T>(endpoint: string, data: any): Promise<Observable<T>> {
    const headers = await this.getHeaders();
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, { headers }).pipe(
      catchError(error => this.handleError<T>(error))
    );
  }

  // Método genérico para peticiones POST
  post2<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
      catchError(error => this.handleError<T>(error))
    );
  }

  // Método genérico para peticiones PUT (Actualizar)
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
      catchError(error => this.handleError<T>(error))
    );
  }

  // Método genérico para peticiones DELETE
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`).pipe(
      catchError(error => this.handleError<T>(error))
    );
  }

  // Manejo de errores con notificación en pantalla
  // private async handleError(error: any): Promise<never> {
  //   const toast = await this.toastCtrl.create({
  //     message: 'Error en la conexión con el servidor',
  //     duration: 3000,
  //     color: 'danger'
  //   });
  //   await toast.present();
  //   throw error;
  // }

  private handleError<T>(error: HttpErrorResponse): Observable<T> {
    if (error.status === 401) {
      console.error('Token expirado. Redirigiendo al login...');
      this.storage.remove('token'); // Eliminar token expirado
      this.storage.remove('idRol');
      this.storage.remove('idUsuario');
      this.router.navigate(['/login']); // Redirigir al login
    } else {
      console.error('Error en API:', error);
    }

    return throwError(() => new Error(error.message)) as Observable<T>; // Corregir el tipo devuelto
  }
}
