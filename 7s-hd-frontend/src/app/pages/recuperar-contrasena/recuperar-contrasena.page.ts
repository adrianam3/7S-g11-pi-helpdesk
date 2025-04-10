
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
  standalone: false,
})
export class RecuperarContrasenaPage {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async sendRecoveryEmail() {
    if (this.form.invalid) {
      this.showToast('Por favor ingresa un correo válido', 'danger');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Enviando correo...' });
    await loading.present();

    const formData = new FormData();
    formData.append('email', this.form.value.email);

    this.http.post(`${environment.apiUrl}/controllers/recuperarcontrasena.controller.php?op=recuperar`, formData)
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
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
