// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { environment } from '../../environments/environment';
// import { ToastController } from '@ionic/angular';
// import { SecureStorageService } from './secure-storage.service';
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {
//   private apiUrl = environment.apiUrl; // URL base del backend

//   constructor(private http: HttpClient, private toastCtrl: ToastController,
//     private storage: SecureStorageService,
//     private router: Router
//   ) { }

//   private async getHeaders(): Promise<HttpHeaders> {
//     const token = await this.storage.get('token') || '';
//     const idRol = await this.storage.get('idRol') || '';
//     const idUsuario = await this.storage.get('idUsuario') || '';

//     return new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//       'idRol': idRol.toString(),
//       'idUsuario': idUsuario.toString()
//     });
//   }

//   // // Método genérico para peticiones GET
//   // get<T>(endpoint: string, params?: any): Observable<T> {
//   //   return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params }).pipe(
//   //     catchError(error => this.handleError(error))
//   //   );
//   // }


//   async getSinT<T>(endpoint: string): Promise<Observable<T>> {
//     const headers = await this.getHeaders();
//     return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { headers }).pipe(
//       catchError((error) => this.handleError<T>(error)) // Asegurar compatibilidad de tipos
//     );
//   }

//   async post<T>(endpoint: string, data: any): Promise<Observable<T>> {
//     const headers = await this.getHeaders();
//     return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, { headers }).pipe(
//       catchError(error => this.handleError<T>(error))
//     );
//   }

//   // Método genérico para peticiones POST
//   post2<T>(endpoint: string, data: any): Observable<T> {
//     return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
//       catchError(error => this.handleError<T>(error))
//     );
//   }

//   // Método genérico para peticiones PUT (Actualizar)
//   put<T>(endpoint: string, data: any): Observable<T> {
//     return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
//       catchError(error => this.handleError<T>(error))
//     );
//   }

//   // Método genérico para peticiones DELETE
//   delete<T>(endpoint: string): Observable<T> {
//     return this.http.delete<T>(`${this.apiUrl}/${endpoint}`).pipe(
//       catchError(error => this.handleError<T>(error))
//     );
//   }

//   // Metodo GET
//   async get<T>(endpoint: string, params?: any): Promise<Observable<T>> {
//     const token = await this.storage.get('token'); // Obtener el token almacenado
//     const idUsuario = await this.storage.get('idUsuario');
//     const idRol = await this.storage.get('idRol');

//     console.log('Token obtenido:', token);
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//       'idUsuario': idUsuario,
//       'idRol': idRol
//     });

//     return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { headers, params }).pipe(
//       catchError(error => this.handleError<T>(error))
//     );
//   }

//   // Metodo POST - Consulta al backend mediante post enviaando las variables de sesión en la cabecera.
//   async postData(data: any, operation: string): Promise<Observable<any>> {
//     const idUsuario = await this.storage.get('idUsuario');
//     const idRol = await this.storage.get('idRol');

//     const headers = new HttpHeaders({
//       'idUsuario': idUsuario,
//       'idRol': idRol
//     });

//     return this.http.post(
//       `${this.apiUrl}/controllers/ticket.controller.php?${operation}`,
//       data,
//       {
//         headers,
//         withCredentials: true
//       }
//     ).pipe(
//       catchError(error => this.handleError(error))
//     );
//   }

//   async postFormData<T>(endpoint: string, formData: FormData): Promise<Observable<T>> {
//     const idUsuario = await this.storage.get('idUsuario');
//     const idRol = await this.storage.get('idRol');

//     const headers = new HttpHeaders({
//       'idUsuario': idUsuario || '',
//       'idRol': idRol || ''
//     });

//     return this.http.post<T>(`${this.apiUrl}/${endpoint}`, formData, { headers }).pipe(
//       catchError(error => this.handleError<T>(error))
//     );
//   }


//   private handleError<T>(error: HttpErrorResponse): Observable<T> {
//     if (error.status === 401) {
//       console.error('Token expirado. Redirigiendo al login...');
//       this.storage.remove('token'); // Eliminar token expirado
//       this.storage.remove('idRol');
//       this.storage.remove('idUsuario');
//       this.router.navigate(['/login']); // Redirigir al login
//     } else {
//       console.error('Error en API:', error);
//     }

//     return throwError(() => new Error(error.message)) as Observable<T>; // Corregir el tipo devuelto
//   }

//   createFormData(data: { [key: string]: any }): FormData {
//     const formData = new FormData();
//     for (const key in data) {
//       if (data.hasOwnProperty(key)) {
//         const value = data[key];
//         formData.append(key, value != null ? value : '');
//       }
//     }
//     return formData;
//   }

// }

// am - 00904

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ToastController } from '@ionic/angular';
import { SecureStorageService } from './secure-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private storage: SecureStorageService,
    private router: Router
  ) {}

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

  // private async mostrarErrorToast(error: HttpErrorResponse): Promise<void> {
  //   let mensaje = 'Ocurrió un error inesperado.';

  //   if (error.error?.message) {
  //     mensaje = error.error.message;
  //   } else if (typeof error.error === 'string') {
  //     mensaje = error.error;
  //   } else if (error.status === 0) {
  //     mensaje = 'No se pudo conectar con el servidor.';
  //   }

  //   const toast = await this.toastCtrl.create({
  //     message: mensaje,
  //     duration: 4000,
  //     position: 'bottom',
  //     color: 'danger'
  //   });

  //   await toast.present();
  // }


  private async mostrarErrorToast(error: HttpErrorResponse): Promise<void> {
    let mensaje = 'Ocurrió un error inesperado.';
  
    // ✅ Detectar mensaje tipo: { error: 'mensaje' }
    if (error.error?.error) {
      mensaje = error.error.error;
    }
    // ✅ Detectar mensaje tipo: { message: 'mensaje' }
    else if (error.error?.message) {
      mensaje = error.error.message;
    }
    // ✅ Detectar mensaje en string tipo JSON
    else if (typeof error.error === 'string') {
      try {
        const parsed = JSON.parse(error.error);
        if (parsed?.error) {
          mensaje = parsed.error;
        } else if (parsed?.message) {
          mensaje = parsed.message;
        } else {
          mensaje = error.error;
        }
      } catch {
        mensaje = error.error;
      }
    }
    // ❌ Si no hay nada legible, mostrar mensaje genérico
    // else if (error.status === 0) {
    //   mensaje = 'No se pudo conectar con el servidor.';
    // }
    else if (error.status === 413) {
      mensaje = 'El contenido del detalle excede el tamaño permitido. Reduce el tamaño o cantidad de imágenes.';
    } else if (error.status === 0) {
      mensaje = 'No se pudo conectar con el servidor.';
    }
    
    // const toast = await this.toastCtrl.create({
    //   message: mensaje,
    //   duration: 5000,
    //   position: 'bottom',
    //   color: 'danger'
    //   cssClass: 'toast-error-grande'
    // });
    const toast = await this.toastCtrl.create({
      message: mensaje,
      position: 'bottom',
      color: 'danger',
      cssClass: 'toast-error-grande',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    
  
    await toast.present();
  }
  

  private handleError<T>(error: HttpErrorResponse): Observable<T> {
    if (error.status === 401) {
      console.error('Token expirado. Redirigiendo al login...');
      this.storage.remove('token');
      this.storage.remove('idRol');
      this.storage.remove('idUsuario');
      this.router.navigate(['/login']);
    } else {
      this.mostrarErrorToast(error);
      console.error('Error en API:', error);
    }

    return throwError(() => new Error(error.message)) as Observable<T>;
  }

  async get<T>(endpoint: string, params?: any): Promise<Observable<T>> {
    const headers = await this.getHeaders();
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { headers, params }).pipe(
      catchError(error => this.handleError<T>(error))
    );
  }

  async getSinT<T>(endpoint: string): Promise<Observable<T>> {
    const headers = await this.getHeaders();
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { headers }).pipe(
      catchError(error => this.handleError<T>(error))
    );
  }

  async post<T>(endpoint: string, data: any): Promise<Observable<T>> {
    const headers = await this.getHeaders();
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, { headers }).pipe(
      catchError(error => this.handleError<T>(error))
    );
  }

  post2<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
      catchError(error => this.handleError<T>(error))
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
      catchError(error => this.handleError<T>(error))
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`).pipe(
      catchError(error => this.handleError<T>(error))
    );
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<Observable<T>> {
    const idUsuario = await this.storage.get('idUsuario');
    const idRol = await this.storage.get('idRol');

    const headers = new HttpHeaders({
      'idUsuario': idUsuario || '',
      'idRol': idRol || ''
    });

    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, formData, { headers }).pipe(
      catchError(error => this.handleError<T>(error))
    );
  }

  async postData(data: any, operation: string): Promise<Observable<any>> {
    const idUsuario = await this.storage.get('idUsuario');
    const idRol = await this.storage.get('idRol');

    const headers = new HttpHeaders({
      'idUsuario': idUsuario || '',
      'idRol': idRol || ''
    });

    const url = `${this.apiUrl}/controllers/ticket.controller.php?${operation}`;

    // return this.http.post(url, data, {
    //   headers,
    //   withCredentials: true
    // }).pipe(
    //   catchError(async (error) => {
    //     await this.mostrarErrorToast(error);
    //     return this.handleError(error);
    //   }) as any
    // );
    return this.http.post(url, data, {
      headers,
      withCredentials: true
    }).pipe(
      catchError((error) => {
        this.mostrarErrorToast(error); // No es necesario el await aquí
        return this.handleError(error);
      })
    );
    
  }

  createFormData(data: { [key: string]: any }): FormData {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        formData.append(key, value != null ? value : '');
      }
    }
    return formData;
  }
}
