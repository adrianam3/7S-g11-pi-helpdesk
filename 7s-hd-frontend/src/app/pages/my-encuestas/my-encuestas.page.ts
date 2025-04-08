import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SecureStorageService } from 'src/app/services/secure-storage.service';
import { ValidarRolesService } from 'src/app/services/validar-roles.service';
import { ModalController } from '@ionic/angular';
import { EncuestaModalComponent } from 'src/app/modals/encuesta-modal/encuesta-modal.component';
// import { EncuestaModalComponent } from '../modals/encuesta-modal/encuesta-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PopoverController } from '@ionic/angular';



@Component({
  selector: 'app-my-encuestas',
  templateUrl: './my-encuestas.page.html',
  styleUrls: ['./my-encuestas.page.scss'],
  standalone: false
})
export class MyEncuestasPage implements OnInit {

  public encuestasAll: any[] = [];
  public encuestasFiltradas: any[] = [];
  public buscarTexto: string = '';
  public loading: boolean = false;
  public filtroSeleccionado: string = 're';
  public idUsuario: string = '';
  public datosCargados: boolean = false;
  encuestasPendientes: any[] = [];
  private readonly opi = 'insertar';

  constructor(
    private apiService: ApiService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private validarRol: ValidarRolesService,
    private storage: SecureStorageService,
    private modalController: ModalController,
    private popoverController: PopoverController
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
      console.log(data);
      this.encuestasAll = data.map((e:
        {
          idTicket: any; idEncuesta: any;
          titulo: any; nombreAgente: any;
          descripcion: any
          fechaRespuestaEncuesta: any;
          nombreCompletoUsuario: any;
          puntuacion: any;
          comentarios: any;
          fechaCreacion: any;
          fechaCierre: any;
          estadoEncuesta: any;
          completada: any;
          departamentoAgente: any;
          emailAgente: any;
          estadoticket: any;
          idUsuario: any;
          usuario: any;
        }) => ({
          idTicket: e.idTicket,
          idEncuesta: e.idEncuesta,
          titulo: e.titulo,
          descripcion: e.descripcion,
          nombreAgente: e.nombreAgente,
          fechaEncuesta: e.fechaRespuestaEncuesta,
          nombreUsuario: e.nombreCompletoUsuario,
          puntuacion: e.puntuacion,
          comentarios: e.comentarios,
          fechaCreacion: e.fechaCreacion,
          fechaCierre: e.fechaCierre,
          estadoEncuesta: e.estadoEncuesta,
          completada: e.completada,
          departamentoAgente: e.departamentoAgente,
          emailAgente: e.emailAgente,
          estadoticket: e.estadoticket,
          idUsuario: e.idUsuario,
          usuario: e.usuario,
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
        String(e.puntuacion || '').includes(texto) ||
        String(e.idTicket || '').includes(texto)
      );
  }

  irAResponder(encuesta: any) {
    // Suponiendo que usas el idTicket o idEncuesta para pasar a la página de respuesta
    this.router.navigate(['/responder-encuesta', encuesta.idEncuesta]);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }

  // --> amerlo modal encuetas

  // abrirEncuestaModal(ticket: any) {
  //   this.modalController.create({
  //     component: EncuestaModalComponent,
  //     componentProps: { ticket },
  //     cssClass: 'encuesta-modal-popover'
  //   }).then(modal => {
  //     modal.present();

  //     modal.onDidDismiss().then(async ({ data, role }) => {
  //       if (role === 'enviada' && data) {
  //         const { puntuacion, comentario } = data;

  //         try {
  //           const idUsuario = await this.storage.get('idUsuario');
  //           const formData = new FormData();
  //           formData.append('idTicket', ticket.idTicket);
  //           formData.append('idUsuario', idUsuario);
  //           formData.append('puntuacion', puntuacion);
  //           formData.append('comentarios', comentario);

  //           const response$ = await this.apiService.postFormData(`controllers/encuesta.controller.php?op=${this.opi}`, formData);
  //           await lastValueFrom(response$);

  //           this.showToast('Encuesta guardada exitosamente', 'success');
  //           this.loadEncuestas(); // 🔄 Refrescar lista
  //         } catch (error) {
  //           console.error('Error al guardar encuesta:', error);
  //           this.showToast('Error al guardar la encuesta', 'danger');
  //         }
  //       }
  //     });
  //   });
  // }


  // abrirEncuestaModal(ticket: any) {
  //   this.modalController.create({
  //     component: EncuestaModalComponent,
  //     componentProps: { ticket },
  //     cssClass: 'encuesta-modal-popover'
  //   }).then(modal => {
  //     modal.present();
  
  //     modal.onDidDismiss().then(async ({ data, role }) => {
  //       if (role === 'enviada' && data) {
  //         const { puntuacion, comentario } = data;
  
  //         try {
  //           const idUsuario = await this.storage.get('idUsuario');
  //           const formData = new FormData();
  //           formData.append('idTicket', ticket.idTicket);
  //           formData.append('idUsuario', idUsuario);
  //           formData.append('puntuacion', puntuacion);
  //           formData.append('comentarios', comentario);
  
  //           const response$ = await this.apiService.postFormData(`controllers/encuesta.controller.php?op=${this.opi}`, formData);
  //           const responseData: any = await lastValueFrom(response$);
  
  //           // 🐞 Ver respuesta completa en consola
  //           //console.log('Respuesta del backend:', responseData);
  
  //           const correoOk = responseData?.correo === 'ok';
  //           this.showToast(
  //             correoOk
  //               ? 'Encuesta guardada y correo enviado exitosamente.'
  //               : `Encuesta guardada, pero hubo un error al enviar el correo: ${responseData?.correo || 'desconocido'}`,
  //             correoOk ? 'success' : 'warning'
  //           );
  
  //           // 🔄 Refrescar encuestas después de guardar
  //           this.loadEncuestas();
  //         } catch (error) {
  //           console.error('Error al guardar encuesta:', error);
  //           this.showToast('Error al guardar la encuesta', 'danger');
  //         }
  //       }
  //     });
  //   });
  // }
  
  abrirEncuestaModal(ticket: any) {
    this.modalController.create({
      component: EncuestaModalComponent,
      componentProps: { ticket },
      cssClass: 'encuesta-modal-popover'
    }).then(modal => {
      modal.present();
  
      modal.onDidDismiss().then(async ({ data, role }) => {
        if (role === 'enviada' && data) {
          const { puntuacion, comentario } = data;
  
          const loading = await this.loadingController.create({
            message: 'Guardando encuesta...',
            spinner: 'bubbles'
          });
          await loading.present();
  
          try {
            const idUsuario = await this.storage.get('idUsuario');
            const formData = new FormData();
            formData.append('idTicket', ticket.idTicket);
            formData.append('idUsuario', idUsuario);
            formData.append('puntuacion', puntuacion);
            formData.append('comentarios', comentario);
  
            const response$ = await this.apiService.postFormData(`controllers/encuesta.controller.php?op=${this.opi}`, formData);
            const responseData: any = await lastValueFrom(response$);
  
            console.log('Respuesta del backend:', responseData);
  
            const correoOk = responseData?.correo === 'ok';
  
            // ✅ Mostrar feedback inmediato
            const mensaje = correoOk
              ? 'Encuesta guardada y correo enviado exitosamente.'
              : `Encuesta guardada, pero hubo un problema al enviar el correo: ${responseData?.correo || 'desconocido'}`;
  
            this.showToast(mensaje, correoOk ? 'success' : 'warning');
  
            // ✅ Cerrar el modal de inmediato
            this.modalController.dismiss(true);
  
            // 🔄 Refrescar encuestas en segundo plano sin bloquear
            setTimeout(() => this.loadEncuestas(), 300);
  
          } catch (error) {
            console.error('Error al guardar encuesta:', error);
            this.showToast('Error al guardar la encuesta', 'danger');
          } finally {
            await loading.dismiss();
          }
        }
      });
    });
  }
  
}
