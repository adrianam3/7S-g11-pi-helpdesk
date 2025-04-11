import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController  } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { SecureStorageService } from 'src/app/services/secure-storage.service';
import { FormBuilder, Validators } from '@angular/forms';


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
  //alertController: any;

  constructor(
    public router: Router,
    private authService: AuthService,
    private secureStorage: SecureStorageService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private apiService: ApiService,
    private fb: FormBuilder // ✅ nuevo
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
        await this.secureStorage.set('idPersona', response.user.idPersona);
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

  // /**  Recuperación de contraseña usando ApiService */
  // async sendRecoveryEmail() {
  //   this.loading = true;

  //   const formData = {
  //     email: this.recoveryEmail
  //   };

  //   this.apiService.post2('controllers/recuperarcontrasena.controller.php?op=recuperar', formData)
  //     .subscribe({
  //       next: async () => {
  //         this.showToast('Revisa tu bandeja de entrada', 'success');
  //         this.displayRecovery = false;
  //         this.loading = false;
  //       },
  //       error: () => {
  //         this.loading = false;
  //         this.showToast('No se pudo enviar el correo', 'danger');
  //       }
  //     });
  // }
//funcional no envia vien el url
  // async sendRecoveryEmail() {
  //   const alert = await this.alertController.create({
  //     header: 'Recuperar contraseña',
  //     inputs: [
  //       {
  //         name: 'recoveryEmail',
  //         type: 'email',
  //         placeholder: 'Correo electrónico'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //         role: 'cancel'
  //       },
  //       {
  //         text: 'Enviar',
  //         handler: (data: { recoveryEmail: string; }) => {
  //           this.recoveryEmail = data.recoveryEmail;
  //           this._sendRecovery();
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }


  // /** Envía el formulario como FormData al backend */
  // private _sendRecovery() {
  //   this.loading = true;

  //   const formData = new FormData();
  //   formData.append('email', this.recoveryEmail);

  //   this.apiService.post2('controllers/recuperarcontrasena.controller.php?op=recuperar', formData)
  //     .subscribe({
  //       next: () => {
  //         this.showToast('Revisa tu bandeja de entrada', 'success');
  //         this.displayRecovery = false;
  //         this.loading = false;
  //       },
  //       error: () => {
  //         this.loading = false;
  //         this.showToast('No se pudo enviar el correo', 'danger');
  //       }
  //     });
  // }

  // async sendRecoveryEmail() {
  //   const alert = await this.alertController.create({
  //     header: 'Recuperar contraseña',
  //     inputs: [
  //       {
  //         name: 'recoveryEmail',
  //         type: 'email',
  //         placeholder: 'Correo electrónico'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //         role: 'cancel'
  //       },
  //       {
  //         text: 'Enviar',
  //         handler: async (data: { recoveryEmail: string }) => {
  //           const email = data.recoveryEmail;
  
  //           if (!email || !email.includes('@')) {
  //             this.showToast('Correo no válido', 'danger');
  //             return;
  //           }
  
  //           const loading = await this.loadingController.create({ message: 'Enviando correo...' });
  //           await loading.present();
  
  //           const formData = new FormData();
  //           formData.append('email', email);
  
  //           this.apiService.post2('controllers/recuperarcontrasena.controller.php?op=recuperar', formData)
  //             .subscribe({
  //               next: async () => {
  //                 await loading.dismiss();
  //                 this.showToast('Correo enviado. Revisa tu bandeja de entrada.', 'success');
  //               },
  //               error: async () => {
  //                 await loading.dismiss();
  //                 this.showToast('No se pudo enviar el correo', 'danger');
  //               }
  //             });
  //         }
  //       }
  //     ]
  //   });
  
  //   await alert.present();
  // }
  
  async sendRecoveryEmail() {
    const alert = await this.alertController.create({
      header: 'Recuperar contraseña',
      inputs: [
        {
          name: 'recoveryEmail',
          type: 'email',
          placeholder: 'Correo electrónico'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Enviar',
          handler: async (data: { recoveryEmail: string }) => {
            const email = data.recoveryEmail;
  
            // Usamos FormBuilder para validarlo como si fuera un formulario
            const tempForm = this.fb.group({
              email: [email, [Validators.required, Validators.email]]
            });
  
            if (tempForm.invalid) {
              this.showToast('Correo no válido', 'danger');
              return false;
            }
  
            const loading = await this.loadingController.create({ message: 'Enviando correo...' });
            await loading.present();
  
            const formData = new FormData();
            formData.append('email', email);
  
            this.apiService.post2('controllers/recuperarcontrasena.controller.php?op=recuperar', formData)
              .subscribe({
                next: async () => {
                  await loading.dismiss();
                  this.showToast('Correo enviado. Revisa tu bandeja de entrada.', 'success');
                },
                error: async () => {
                  await loading.dismiss();
                  this.showToast('No se pudo enviar el correo', 'danger');
                }
              });
            return true;
          }
        }
      ]
    });
  
    await alert.present();
  }
  
}
