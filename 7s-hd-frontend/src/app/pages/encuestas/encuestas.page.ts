import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.page.html',
  styleUrls: ['./encuestas.page.scss'],
  standalone: false
})
export class EncuestasPage implements OnInit {

  public encuestasAll: any[] = [];
  public encuestasFiltradas: any[] = [];
  public buscarTexto: string = '';
  public loading = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    await this.loadEncuestas();
  }

  /** Cargar la lista de encuestas desde la API */
  async loadEncuestas() {
    this.loading = true;
    const loading = await this.loadingController.create({ message: 'Cargando encuestas...' });
    await loading.present();

    try {
      const encuestasObs = await this.apiService.get('controllers/encuesta.controller.php?op=todos');
      const response: any = await lastValueFrom(encuestasObs);
      this.encuestasAll = response.map((e: { idTicket: any; idEncuesta: any; titulo: any; nombreAgente: any; fechaRespuestaEncuesta: any; nombreCompletoUsuario: any; puntuacion: any; comentarios: any; fechaCreacion: any; fechaCierre: any; }) => ({
        idTicket: e.idTicket,
        idEncuesta: e.idEncuesta,
        titulo: e.titulo,
        nombreAgente: e.nombreAgente,
        fechaEncuesta: e.fechaRespuestaEncuesta,
        nombreUsuario: e.nombreCompletoUsuario,
        puntuacion: e.puntuacion,
        comentarios: e.comentarios,
        fechaCreacion: e.fechaCreacion,
        fechaCierre: e.fechaCierre
      }));

      this.filtrarEncuestas();
    } catch (error) {
      console.error('Error al cargar encuestas', error);
      this.showToast('No se pudieron cargar las encuestas.', 'danger');
    } finally {
      this.loading = false;
      await loading.dismiss();
    }
  }

  /** Filtrar encuestas en tiempo real */
  filtrarEncuestas() {
    const texto = this.buscarTexto.toLowerCase();
    this.encuestasFiltradas = this.encuestasAll.filter(encuesta =>
      encuesta.titulo.toLowerCase().includes(texto) ||
      encuesta.nombreAgente.toLowerCase().includes(texto) ||
      encuesta.nombreUsuario.toLowerCase().includes(texto) ||
      encuesta.comentarios.toLowerCase().includes(texto) ||
      String(encuesta.puntuacion).includes(texto)
    );
  }

  /** Confirmar eliminación de una encuesta */
  async confirmEliminar(idEncuesta: string, titulo: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar Encuesta',
      message: `¿Estás seguro de eliminar la encuesta titulada "${titulo}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.eliminarEncuesta(idEncuesta) }
      ]
    });
    await alert.present();
  }

  /** Eliminar encuesta */
  async eliminarEncuesta(idEncuesta: string) {
    const loading = await this.loadingController.create({ message: 'Eliminando encuesta...' });
    await loading.present();

    try {
      const encuestasObs = await this.apiService.post('controllers/encuesta.controller.php?op=eliminar', { idEncuesta });
      const response: any = await lastValueFrom(encuestasObs);

      if (response.status !== 'error') {
        this.showToast('Encuesta eliminada correctamente.', 'success');
        await this.loadEncuestas();
      } else {
        this.showToast(response.message, 'danger');
      }

    } catch (error) {
      console.error('Error al eliminar la encuesta', error);
      this.showToast('No se pudo eliminar la encuesta.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  /** Método para mostrar mensajes */
  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }
}
