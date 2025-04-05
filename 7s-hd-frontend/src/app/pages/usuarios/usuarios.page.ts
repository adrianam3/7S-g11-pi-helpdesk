import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: false
})
export class UsuariosPage implements OnInit {

  public usuariosAll: any[] = [];
  public usuariosFiltrados: any[] = [];
  public buscarTexto: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    await this.loadUsuarios();
  }

  /** 🔹 Método para obtener la lista de usuarios */
  async loadUsuarios() {
    const loading = await this.loadingController.create({ message: 'Cargando usuarios...' });
    await loading.present();

    try {
      const usuariosObs = await this.apiService.get<any[]>('controllers/usuario.controller.php?op=todos');
      const data = await lastValueFrom(usuariosObs);
      console.log(data);

      this.usuariosAll = data.map(u => ({
        idUsuario: u.idUsuario,
        nombreCompleto: `${u.personaNombres} ${u.personaApellidos}`,
        descRol: u.rolNombre,
        descArea: u.areaNombre,
        email: u.personaEmail,
        fechaCreacion: u.fechaCreacion,
        usuario: u.usuario,
        idRol: u.idRol,
        descEstado: u.estado === '1' ? 'Activo' : 'Inactivo'
      }));

      this.usuariosFiltrados = [...this.usuariosAll];

    } catch (error) {
      console.error('Error al cargar usuarios', error);
      this.showToast('Error al obtener los usuarios.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  /** 🔹 Método para filtrar usuarios por búsqueda */
  filtrarUsuarios() {
    const texto = this.buscarTexto.toLowerCase();
    this.usuariosFiltrados = this.usuariosAll.filter(usuario =>
      usuario.nombreCompleto.toLowerCase().includes(texto) ||
      usuario.descRol.toLowerCase().includes(texto) ||
      usuario.email.toLowerCase().includes(texto)
    );
  }

  /** 🔹 Método para confirmar eliminación */
  async confirmarEliminar(usuario: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Usuario',
      message: `¿Estás seguro de eliminar a ${usuario.nombreCompleto}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => this.eliminarUsuario(usuario.idUsuario)
        }
      ]
    });
    await alert.present();
  }

  /** Método para eliminar usuario */
  async eliminarUsuario(idUsuario: string) {
    const loading = await this.loadingController.create({ message: 'Eliminando usuario...' });
    await loading.present();

    try {
      const usuariosObs = await this.apiService.post('controllers/usuario.controller.php?op=eliminar', { idUsuario });
      const data: any = await lastValueFrom(usuariosObs);

      if (data.status !== 'error') {
        this.showToast('Usuario eliminado correctamente.', 'success');
        await this.loadUsuarios(); // Recargar la lista
      } else {
        this.showToast(data.message, 'danger');
      }

    } catch (error) {
      console.error('Error al eliminar usuario', error);
      this.showToast('No se pudo eliminar el usuario.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }
}

