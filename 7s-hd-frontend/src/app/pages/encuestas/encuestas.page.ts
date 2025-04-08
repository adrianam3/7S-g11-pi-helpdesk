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
  public filtroSeleccionado: string = 'pe'; // Valor por defecto: Pendientes


  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    await this.loadEncuestas();
    this.filtrarEncuestasParam(this.filtroSeleccionado); // 👈 recarga correcto al iniciar
  }

  /** Cargar la lista de encuestas desde la API */
  async loadEncuestas() {
    this.loading = true;
    const loading = await this.loadingController.create({ message: 'Cargando encuestas...' });
    await loading.present();

    try {
      const encuestasObs = await this.apiService.get('controllers/encuesta.controller.php?op=todos');
      const response: any = await lastValueFrom(encuestasObs);
      console.log(response);
      this.encuestasAll = response.map((e: { idTicket: any; idEncuesta: any; titulo: any; nombreAgente: any; fechaRespuestaEncuesta: any; nombreCompletoUsuario: any; puntuacion: any; comentarios: any; fechaCreacion: any; fechaCierre: any; estado: any; }) => ({
        idTicket: e.idTicket,
        idEncuesta: e.idEncuesta,
        titulo: e.titulo,
        nombreAgente: e.nombreAgente,
        fechaEncuesta: e.fechaRespuestaEncuesta,
        nombreUsuario: e.nombreCompletoUsuario,
        puntuacion: e.puntuacion,
        comentarios: e.comentarios,
        fechaCreacion: e.fechaCreacion,
        fechaCierre: e.fechaCierre,
        // estado: e.estado
        estado: e.fechaRespuestaEncuesta ? 'respondida' : 'pendiente' // 👈 importante
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
      encuesta.nombreAgente?.toLowerCase().includes(texto) ||
      encuesta.nombreUsuario.toLowerCase().includes(texto) ||
      encuesta.comentarios?.toLowerCase().includes(texto) ||
      String(encuesta.puntuacion).includes(texto) ||
      String(encuesta.idTicket).includes(texto)
    );
  }

  // async filtrarEncuestasParam(valor: any) {
  //   this.filtroSeleccionado = valor;

  //   if (valor === 're') {
  //     this.filtrarEncuestas(); // Aplica el filtro por texto
  //   } else if (valor === 'respondidas') {
  //     this.encuestasFiltradas = this.encuestasAll.filter(e => !!e.fechaEncuesta); // FechaEncuesta definida
  //   } else if (valor === 'pendientes') {
  //     await this.cargarTicketsPendientes(); // Consulta desde la API
  //   }
  // }

  // async cargarTicketsPendientes() {
  //   const loading = await this.loadingController.create({ message: 'Cargando tickets pendientes...' });
  //   await loading.present();

  //   try {
  //     const responseObs: any = await this.apiService.get('controllers/encuesta.controller.php?op=ticketsSinEncuesta');
  //     const data: any[] = await lastValueFrom(responseObs);

  //     this.encuestasFiltradas = data.map(ticket => ({
  //       idTicket: ticket.idTicket,
  //       titulo: ticket.titulo,
  //       nombreAgente: ticket.nombreAgente,
  //       nombreUsuario: ticket.nombreCompletoUsuario,
  //       fechaEncuesta: null,
  //       puntuacion: null,
  //       comentarios: '',
  //       fechaCreacion: ticket.fechaCreacion,
  //       fechaCierre: ticket.fechaCierre,
  //     }));

  //   } catch (error) {
  //     console.error('Error cargando tickets pendientes', error);
  //     this.showToast('Error al cargar tickets pendientes.', 'danger');
  //   } finally {
  //     await loading.dismiss();
  //   }
  // }


  filtrarEncuestasParam(valor: any) {
    this.filtroSeleccionado = String(valor || 'pe');

    const estadoFiltro = this.filtroSeleccionado === 're' ? 'respondida' : 'pendiente';
    const texto = this.buscarTexto.toLowerCase();

    this.encuestasFiltradas = this.encuestasAll
      .filter(encuesta => encuesta.estado === estadoFiltro)
      .filter(encuesta =>
        encuesta.titulo.toLowerCase().includes(texto) ||
        (encuesta.nombreAgente || '').toLowerCase().includes(texto) ||
        (encuesta.nombreUsuario || '').toLowerCase().includes(texto) ||
        (encuesta.comentarios || '').toLowerCase().includes(texto) ||
        String(encuesta.puntuacion || '').includes(texto) ||
        String(encuesta.idTicket).includes(texto)
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
