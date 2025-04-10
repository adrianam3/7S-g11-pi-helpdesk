import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false
})
export class ChatComponent  implements OnInit {
  @Input() mensajes: any = [];
  @Input() ticketForm!: FormGroup;
  @Input() validarRol: any;

  ticketDetalleForm: FormGroup;

  constructor(private modalCtrl: ModalController, private fb: FormBuilder) {
    this.ticketDetalleForm = this.fb.group({
      detalle: ['']
    });
  }
  public async ionViewWillEnter() {
    // await this.validarRol.cargarDatos();
    // this.validarRol.datosCargados$.subscribe(async (cargado: any) => {
    //   if (cargado) {
    //     this.validarRol.rol$.subscribe((idRol: any) => {
    //       console.log('ROL DETECTADO:', idRol);
    //       // Aquí puedes hacer lógica específica según el rol
    //     });
      // }
    // });
  }
  ngOnInit(): void {
    console.log('Mensajes:', this.mensajes);
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  enviarMensaje() {
    const detalle = this.ticketDetalleForm.value.detalle;
    // Emitir evento o enviar al backend
    console.log('Enviar:', detalle);
    this.modalCtrl.dismiss({ detalle });
  }
}