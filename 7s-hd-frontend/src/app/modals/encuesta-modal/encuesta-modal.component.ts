import { Component, Input } from '@angular/core';
// import { ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { IonicModule } from '@ionic/angular';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecureStorageService } from 'src/app/services/secure-storage.service';


// @Component({
//   selector: 'app-encuesta-modal',
//   templateUrl: './encuesta-modal.component.html',
//   styleUrls: ['./encuesta-modal.component.scss'],
//   standalone: true //--amerlo
// })

@Component({

  selector: 'app-encuesta-modal',
  templateUrl: './encuesta-modal.component.html',
  styleUrls: ['./encuesta-modal.component.scss'],
  standalone: true,
   imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})

export class EncuestaModalComponent {
  @Input() ticket: any;
  valorSeleccionado = 0;
  comentario = '';
  numeros = Array.from({ length: 10 }, (_, i) => i + 1);

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private toastController: ToastController,
    private alertController: AlertController,
    private secureStorage: SecureStorageService // Secure storage Añadido
  ) {}

  seleccionar(num: number) {
    this.valorSeleccionado = num;
  }

  getEmojiIcon(num: number): string {
    if (num <= 4) return 'sad-outline';
    if (num <= 7) return 'alert-circle-outline';
    return 'happy-outline';
  }

  getEmojiColor(num: number): string {
    if (num <= 4) return 'danger';
    if (num <= 7) return 'warning';
    return 'success';
  }

  getBackgroundColor(num: number): string {
    if (this.valorSeleccionado >= num) {
      if (this.valorSeleccionado <= 4) return 'fondo-rojo';
      if (this.valorSeleccionado <= 7) return 'fondo-amarillo';
      return 'fondo-verde';
    }
    return '';
  }

  // async enviarEncuesta() {
  //   if (!this.comentario || this.valorSeleccionado === 0) {
  //     this.mostrarToast('Debes ingresar un comentario y calificar.', 'danger');
  //     return;
  //   }

  //   const payload = {
  //     idTicket: this.ticket.idTicket,
  //     puntuacion: this.valorSeleccionado,
  //     comentarios: this.comentario
  //   };

  //   try {
  //     await (await this.api.post(`controllers/encuesta.controller.php?op=responder`, payload)).toPromise();
  //     this.mostrarToast('Encuesta enviada correctamente', 'success');
  //     this.modalCtrl.dismiss(true, 'enviada');
  //   } catch (error) {
  //     this.mostrarToast('Error al enviar la encuesta', 'danger');
  //     console.error(error);
  //   }
  // }

  async enviarEncuesta() {
    if (!this.comentario || this.valorSeleccionado === 0) {
      this.mostrarToast('Debes ingresar un comentario y calificar.', 'danger');
      return;
    }
  
    // Devuelve los datos al componente padre sin hacer la inserción
    this.modalCtrl.dismiss(
      {
        puntuacion: this.valorSeleccionado,
        comentario: this.comentario,
        idTicket: this.ticket.idTicket
      },
      'enviada'
    );
  }
  
  async confirmarCancelar() {
    const alert = await this.alertController.create({
      header: 'Cancelar Encuesta',
      message: '¿Estás seguro de que deseas cancelar la encuesta?',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Sí',
          handler: async () => {
            await this.mostrarToast('Encuesta cancelada.', 'medium');
            this.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color,
      duration: 2000
    });
    toast.present();
  }
}
