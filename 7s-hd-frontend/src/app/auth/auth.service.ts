import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SecureStorageService } from '../services/secure-storage.service';
// import { Router } from '@angular/router';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../services/api.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);
  private userUpdated = new BehaviorSubject<boolean>(false); // evento para actualizar usuario
  private API_URL = 'https://tu-api.com/auth';

  constructor(private http: HttpClient,
    private secureStorage: SecureStorageService,
    private router: Router,
    private apiService: ApiService) { }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.secureStorage.get('token');
    return !!token;
  }

  loginold(credentials: FormData): Observable<any> {
    // return this.http.post(`${this.API_URL}/login`, credentials).pipe(
    return this.http.post<any>(this.API_URL, credentials).pipe(
      tap(async (res) => {
        if (res.token) {
          await this.secureStorage.set('token', res.token);
          this.authState.next(true);
          this.router.navigate(['/home']); // Redirigir a Home después del login
        }
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.apiService.post2('controllers/login.controller.php', credentials).pipe(
      tap(async (response: any) => {
        if (response.user) {
          // Guardar datos del usuario en almacenamiento seguro
          await this.secureStorage.set('idUsuario', response.user.idUsuario);
          await this.secureStorage.set('idRol', response.user.idRol);
          await this.secureStorage.set('email', response.user.email);
          await this.secureStorage.set('nombres', response.user.nombres);
          await this.secureStorage.set('apellidos', response.user.apellidos);
          await this.secureStorage.set('token', response.token);
        }
      })
    );
  }


  async logout() {
    await this.secureStorage.remove('token');
    await this.secureStorage.remove('idUsuario');
    await this.secureStorage.remove('idRol');
    await this.secureStorage.remove('email');
    await this.secureStorage.remove('nombres');
    await this.secureStorage.remove('apellidos');
    this.authState.next(false);
    this.userUpdated.next(true); // Notificar que el usuario ha cambiado
    this.router.navigate(['/login']); // Redirigir a Login después del logout
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  getUserUpdate(): Observable<boolean> {
    return this.userUpdated.asObservable();
  }

  triggerUserUpdate() {
    this.userUpdated.next(true); // Notificar que el usuario ha cambiado
  }

//am
async canActivate(): Promise<boolean> {
  const token = await this.secureStorage.get('token');
  const isLoggedIn = token && token !== '';

  if (isLoggedIn) {
    return true;
  } else {
    this.router.navigate(['/login']);
    return false;
  }
}


}
