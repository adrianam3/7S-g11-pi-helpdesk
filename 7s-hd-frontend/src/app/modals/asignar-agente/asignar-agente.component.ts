import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-asignar-agente',
  templateUrl: './asignar-agente.component.html',
  styleUrls: ['./asignar-agente.component.scss'],
  standalone: false
})
export class AsignarAgenteComponent implements OnInit {
  @Input() ticket: any;
  @Input() departamentoAgentes: any[] = [];
  @Input() todosAgentes: any[] = [];
  @Input() opcion: number = 0;

  asignarForm = new FormGroup({
    departamentoAgente: new FormControl(null, Validators.required),
    idAgente: new FormControl(null, Validators.required)
  });

  public agentes: any[] = [];

  agentesFiltrados: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private apiService: ApiService,
  ) { }

  ngOnInit() { }

  async onDepartamentoChange(event: any) {
    const idDepartamento = event.detail.value;
    this.getAgentes(idDepartamento);
  }

  async getAgentes(idDepartamento: number) {
    try {
      const agentes: any = await (await this.apiService.get(`controllers/agente.controller.php?op=todosByDepartamento&idDepartamentoA=${idDepartamento}`)).toPromise();
      this.agentes = agentes;
    } catch (err) {
      this.agentes = [];
    }
  }

  async confirmarAsignacion() {
    if (this.asignarForm.invalid) {
      this.asignarForm.markAllAsTouched(); // Muestra los mensajes de error
      return;
    }
    const alert = await this.alertCtrl.create({
      header: this.opcion === 1 ? 'Confirmar Asignación' : 'Confirmar Escalamiento',
      message: '¿Desea asignar este ticket al agente seleccionado?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => {
            this.modalCtrl.dismiss({
              idAgente: this.asignarForm.value.idAgente,
              idDepartamentoA: this.asignarForm.value.departamentoAgente,
              confirmado: true
            });
          }
        }
      ]
    });
    await alert.present();
  }


  async cerrar() {
    const alert = await this.alertCtrl.create({
      header: this.opcion === 1 ? 'Cancelar la Asignación' : 'Cancelar el Escalamiento',
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
}
