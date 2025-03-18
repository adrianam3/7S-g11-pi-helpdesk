import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-agentes',
  templateUrl: './agentes.page.html',
  styleUrls: ['./agentes.page.scss'],
  standalone: false
})
export class AgentesPage implements OnInit {
  public agentesAll: any[] = [];
  public agentesFiltrados: any[] = [];
  public buscarTexto: string = '';
  public loading = false;

  constructor(
    private apiService: ApiService,
    public router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    await this.loadAgentes();
  }

  /** Cargar la lista de agentes desde la API */
  async loadAgentes() {
    this.loading = true;
    const loading = await this.loadingController.create({ message: 'Cargando agentes...' });
    await loading.present();

    try {
      const agentesObs = await this.apiService.get<any[]>('controllers/agente.controller.php?op=todos');
      const data = await lastValueFrom(agentesObs);
      this.agentesAll = data.map((u) => ({
        idAgente: u.idAgente,
        agente: u.agente,
        descripcion: u.descripcion,
        idUsuario: u.idUsuario || 'No proporcionado',
        descUsuario: u.agenteNombreCompleto || 'No proporcionado',
        idNivelAgente: u.idNivelAgente || 'No proporcionado',
        descEstado: u.estado === '1' ? 'Activo' : 'Inactivo',
        fechaCreacion: u.fechaCreacion
      }));

      this.filtrarAgentes();
    } catch (error) {
      console.error('Error al cargar agentes', error);
      this.showToast('No se pudieron cargar los agentes.', 'danger');
    } finally {
      this.loading = false;
      await loading.dismiss();
    }
  }

  /** Filtrar agentes en tiempo real */
  filtrarAgentes() {
    const texto = this.buscarTexto.toLowerCase();
    this.agentesFiltrados = this.agentesAll.filter(agente =>
      agente.agente.toLowerCase().includes(texto) ||
      agente.descUsuario.toLowerCase().includes(texto) ||
      agente.descEstado.toLowerCase().includes(texto)
    );
  }

  /** Confirmar eliminación de un agente */
  async confirmEliminar(idAgente: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar Agente',
      message: '¿Estás seguro de eliminar este agente?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.eliminarAgente(idAgente) }
      ]
    });
    await alert.present();
  }

  /** 🗑️ Eliminar agente */
  async eliminarAgente(idAgente: string) {
    const loading = await this.loadingController.create({ message: 'Eliminando agente...' });
    await loading.present();

    try {
      const agentesObs = await this.apiService.delete(`controllers/agente.controller.php?op=eliminar&idAgente=${idAgente}`);

      const data: any = await lastValueFrom(agentesObs);

      if (data.status !== 'error') {
        this.showToast('Agente eliminado correctamente.', 'success');
        await this.loadAgentes(); // Recargar la lista
      } else {
        this.showToast(data.message, 'danger');
      }

    } catch (error) {
      console.error('Error al eliminar el agente', error);
      this.showToast('No se pudo eliminar el agente.', 'danger');
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
