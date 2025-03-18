import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { SecureStorageService } from 'src/app/services/secure-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  recoveryEmail: string = '';
  displayRecovery: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private secureStorage: SecureStorageService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private apiService: ApiService
  ) { }

  async ngOnInit() {
    const isAuthenticated = await this.authService.isAuthenticated();

    // Si el usuario ya está autenticado, redirigir a Home
    if (isAuthenticated) {
      this.router.navigate(['/home']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /** Iniciar sesión con ApiService */
  async login() {
    const formData = {
      email: this.email,
      password: this.password
    };

    const loading = await this.loadingController.create({ message: 'Iniciando sesión...' });
    await loading.present();

    this.authService.login(formData).subscribe({
      next: async (response) => {
        console.log(response)
        await this.secureStorage.set('idUsuario', response.user.idUsuario);
        await this.secureStorage.set('idRol', response.user.idRol);
        await this.secureStorage.set('email', response.user.email);
        await this.secureStorage.set('nombres', response.user.nombres);
        await this.secureStorage.set('apellidos', response.user.apellidos);

        // Emitir un evento para actualizar el menú con el nuevo usuario
        this.authService.triggerUserUpdate();

        await loading.dismiss();
        this.showToast('Inicio de sesión exitoso', 'success');
        this.router.navigate(['/home']);
      },
      error: async () => {
        await loading.dismiss();
        this.showToast('Inicio de sesión fallido', 'danger');
      }
    });
  }

  /** Método centralizado para mostrar mensajes */
  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }

  /**  Recuperación de contraseña usando ApiService */
  async sendRecoveryEmail() {
    this.loading = true;

    const formData = {
      email: this.recoveryEmail
    };

    this.apiService.post2('controllers/recuperarcontrasena.controller.php?op=recuperar', formData)
      .subscribe({
        next: async () => {
          this.showToast('Revisa tu bandeja de entrada', 'success');
          this.displayRecovery = false;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.showToast('No se pudo enviar el correo', 'danger');
        }
      });
  }
}
