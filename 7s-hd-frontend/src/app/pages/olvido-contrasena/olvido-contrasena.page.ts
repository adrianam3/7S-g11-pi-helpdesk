
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ToastController, LoadingController } from '@ionic/angular';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';

// @Component({
//   selector: 'app-olvido-contrasena',
//   templateUrl: './olvido-contrasena.page.html',
//   styleUrls: ['./olvido-contrasena.page.scss'],
//   standalone: false,
// })
// export class OlvidoContrasenaPage implements OnInit {

//   resetPasswordForm: FormGroup;
//   token: string='';

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private http: HttpClient,
//     private router: Router,
//     private toastController: ToastController,
//     private loadingController: LoadingController
//   ) {
//     this.resetPasswordForm = this.fb.group({
//       password: ['', [Validators.required, Validators.minLength(6)]]
//     });
//   }

//   ngOnInit() {
//     this.token = this.route.snapshot.queryParamMap.get('token') || '';
//   }

//   async resetPassword() {
//     if (this.resetPasswordForm.invalid || !this.token) {
//       this.presentToast('Contraseña inválida o token faltante', 'danger');
//       return;
//     }

//     const loading = await this.loadingController.create({ message: 'Procesando...' });
//     await loading.present();

//     const formData = new FormData();
//     formData.append('password', this.resetPasswordForm.value.password);
//     formData.append('token', this.token);

//     this.http.post(`${environment.apiUrl}/controllers/recuperarcontrasena.controller.php?op=cambiarContrasena`, formData)
//       .subscribe({
//         next: async () => {
//           await loading.dismiss();
//           this.presentToast('Contraseña actualizada correctamente', 'success');
//           this.router.navigate(['/login']);
//         },
//         error: async () => {
//           await loading.dismiss();
//           this.presentToast('Error al actualizar la contraseña', 'danger');
//         }
//       });
//   }

//   async presentToast(message: string, color: string) {
//     const toast = await this.toastController.create({
//       message,
//       duration: 3000,
//       color,
//       position: 'top'
//     });
//     await toast.present();
//   }
// }



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-olvido-contrasena',
  templateUrl: './olvido-contrasena.page.html',
  styleUrls: ['./olvido-contrasena.page.scss'],
  standalone: false,
})
export class OlvidoContrasenaPage implements OnInit {

  resetPasswordForm: FormGroup;
  token: string = '';
  usuario: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.usuario = this.route.snapshot.queryParamMap.get('usuario') || '';
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { notMatching: true };
  }

  async resetPassword() {
    if (this.resetPasswordForm.invalid || !this.token || !this.usuario) {
      this.presentToast('Verifica que las contraseñas coincidan y cumplan los requisitos.', 'danger');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Procesando...' });
    await loading.present();

    const formData = new FormData();
    formData.append('password', this.resetPasswordForm.value.password);
    formData.append('token', this.token);
    formData.append('usuario', atob(this.usuario)); // decodificar base64

    this.http.post(`${environment.apiUrl}/controllers/recuperarcontrasena.controller.php?op=cambiar`, formData)
      .subscribe({
        next: async () => {
          await loading.dismiss();
          this.presentToast('Contraseña actualizada correctamente', 'success');
          this.router.navigate(['/login']);
        },
        error: async () => {
          await loading.dismiss();
          this.presentToast('Error al actualizar la contraseña', 'danger');
        }
      });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
