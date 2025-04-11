import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false
})
export class ChatComponent implements OnInit {
  @Input() ticketForm!: FormGroup;
  @Input() validarRol: any;
  @Input() ticket: any;
  @Input() tipoDetalle: any;

  ticketDetalleForm: FormGroup;

  constructor(private modalCtrl: ModalController,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
  ) {
    if (this.ticket) {
      this.ticketDetalleForm = this.fb.group({
        detalle: ['', Validators.required],
        idTicket: [this.ticketForm.get('idTicket')?.value],
        idAgente: [this.ticketForm.get('idAgente')?.value],
        idDepartamentoA: this.ticket.idAgente,
        tipoDetalle: this.tipoDetalle,
      });
    } else {
      this.ticketDetalleForm = this.fb.group({ detalle: ['', Validators.required] });
    }
  }
  public async ionViewWillEnter() {
  }

  ngOnInit(): void {
  }

  async cerrarModal() {
    const alert = await this.alertCtrl.create({
      header: 'Cancelar',
      message: '¿Está seguro de cancelar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => {
            this.modalCtrl.dismiss({
              confirmado: false
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarEnvio() {
    if (this.ticketDetalleForm.invalid) {
      this.ticketDetalleForm.markAllAsTouched(); // Muestra los mensajes de error
      return;
    }
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Mensaje',
      message: '¿Está seguro de guardar el detalle?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => {
            this.modalCtrl.dismiss({
              idAgente: this.ticketDetalleForm.value.idAgente,
              idDepartamentoA: this.ticketDetalleForm.value.departamentoAgente,
              detalle: this.ticketDetalleForm.value.detalle,
              confirmado: true
            });
          }
        }
      ]
    });
    await alert.present();
  }
}
