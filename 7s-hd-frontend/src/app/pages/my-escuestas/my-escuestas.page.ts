import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SecureStorageService } from 'src/app/services/secure-storage.service';
import { ValidarRolesService } from 'src/app/services/validar-roles.service';

@Component({
  selector: 'app-my-escuestas',
  templateUrl: './my-escuestas.page.html',
  styleUrls: ['./my-escuestas.page.scss'],
  standalone: false
})
export class MyEscuestasPage implements OnInit {

  public encuestasAll: any[] = [];
  public encuestasFiltradas: any[] = [];
  public buscarTexto: string = '';
  public loading: boolean = false;
  public filtroSeleccionado: string = 're';
  public idUsuario: string = '';
  public datosCargados: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    public validarRol: ValidarRolesService,
    private storage: SecureStorageService
  ) { }


  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.validarRol.cargarDatos();

    this.validarRol.datosCargados$.subscribe(async cargado => {
      if (cargado) {
        this.filtroSeleccionado = 're'; // Reiniciar el segmento visual
        this.idUsuario = await this.storage.get('idUsuario');
        console.log('usuario en encuesta  ' + this.idUsuario);
        await this.loadEncuestas();
      }
    });
  }

  async loadEncuestas() {
    this.loading = true;
        this.encuestasAll = [];
        this.encuestasFiltradas = [];
        const loading = await this.loadingController.create({
          message: 'Cargando...',
          spinner: 'bubbles',
        });
        await loading.present();
        const formData = new FormData();
        formData.append('idUsuario', this.idUsuario);

        try {
          const encuestasObs = await this.apiService.postFormData('controllers/encuesta.controller.php?op=encuestasByUsuario', formData);
          const data: any = await lastValueFrom(encuestasObs);

          this.encuestasAll = data.map((e:
            {
              idTicket: any; idEncuesta: any;
              titulo: any; nombreAgente: any;
              fechaRespuestaEncuesta: any;
              nombreCompletoUsuario: any;
              puntuacion: any;
              comentarios: any;
              fechaCreacion: any;
              fechaCierre: any;
              estadoEncuesta: any;
            }) => ({
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
              estadoEncuesta: e.estadoEncuesta
            }));
          console.log(this.encuestasAll);
          this.filtrarEncuestasParam(this.filtroSeleccionado);
          this.datosCargados = true;
        } catch (error) {
          console.error('Error al cargar Encuestas', error);
          this.showToast('Error al obtener las Encuestas.', 'danger');
        } finally {
          await loading.dismiss();
          this.loading = false
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

  async filtrarEncuestasParam(valor: any) {
    this.filtroSeleccionado = valor;
    const texto = this.buscarTexto.toLowerCase();

    this.encuestasFiltradas = this.encuestasAll
      .filter(e => e.estadoEncuesta === (valor === 're' ? 'respondida' : 'pendiente'))
      .filter(e =>
        e.titulo.toLowerCase().includes(texto) ||
        (e.nombreAgente || '').toLowerCase().includes(texto) ||
        e.nombreUsuario.toLowerCase().includes(texto) ||
        (e.comentarios || '').toLowerCase().includes(texto) ||
        String(e.puntuacion || '').includes(texto)
      );
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
