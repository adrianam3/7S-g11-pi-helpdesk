import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.page.html',
  styleUrls: ['./personas.page.scss'],
  standalone: false
})
export class PersonasPage implements OnInit {

  public personasAll: any[] = [];
  public personasFiltradas: any[] = [];

  public buscarTexto: string = '';

  public currentPage = 1;
  public pageSize = 10; // número registros x página
  public totalPages = 1;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    await this.loadPersonas();
  }

  /** Cargar todas las personas */
  async loadPersonas() {
    const loading = await this.loadingController.create({ message: 'Cargando personas...' });
    await loading.present();

    try {
      const response$ = await this.apiService.get<any[]>('controllers/persona.controller.php?op=todos');
      const data = await lastValueFrom(response$);

      this.personasAll = data.map(p => ({
        idPersona: p.idPersona,
        personaNombreCompleto: p.nombres + ' '+ p.apellidos,
        telefono: p.telefono,
        email: p.email,
        estado: p.estado,
        cedula: p.cedula,
        estadoTexto: p.estado === '1' ? 'Activo' : 'Inactivo'
      }));

      this.personasFiltradas = [...this.personasAll];

    } catch (error) {
      console.error('Error al cargar personas', error);
      this.showToast('Error al obtener las personas.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  /** Filtrar personas por texto */
  filtrarPersonas() {
    const texto = this.buscarTexto.toLowerCase();

    const personasFiltradas = this.personasAll.filter(p =>
      p.personaNombreCompleto.toLowerCase().includes(texto) ||
      p.email.toLowerCase().includes(texto)
    );

    this.totalPages = Math.ceil(personasFiltradas.length / this.pageSize);
    this.currentPage = 1; // primera página
    this.paginar(personasFiltradas);
  }

  paginar(data: any[]) {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.personasFiltradas = data.slice(startIndex, endIndex);
  }

  async confirmarEliminar(persona: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Persona',
      message: `¿Estás seguro de eliminar a ${persona.personaNombreCompleto}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => this.eliminarPersona(persona.idPersona)
        }
      ]
    });
    await alert.present();
  }

  /**Eliminar persona */
  async eliminarPersona(idPersona: string) {
    const loading = await this.loadingController.create({ message: 'Eliminando persona...' });
    await loading.present();

    try {
      const response$ = await this.apiService.post('controllers/persona.controller.php?op=eliminar', { idPersona });
      const data: any = await lastValueFrom(response$);

      if (data.status !== 'error') {
        this.showToast('Persona eliminada correctamente.', 'success');
        await this.loadPersonas();
      } else {
        this.showToast(data.message, 'danger');
      }

    } catch (error) {
      console.error('Error al eliminar persona', error);
      this.showToast('No se pudo eliminar la persona.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  /** Mostrar toast */
  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginar(this.personasAll.filter(p =>
        p.personaNombreCompleto.toLowerCase().includes(this.buscarTexto.toLowerCase()) ||
        p.email.toLowerCase().includes(this.buscarTexto.toLowerCase())
      ));
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginar(this.personasAll.filter(p =>
        p.personaNombreCompleto.toLowerCase().includes(this.buscarTexto.toLowerCase()) ||
        p.email.toLowerCase().includes(this.buscarTexto.toLowerCase())
      ));
    }
  }
}
