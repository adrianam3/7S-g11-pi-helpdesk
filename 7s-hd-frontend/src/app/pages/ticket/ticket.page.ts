import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { AsignarAgenteComponent } from 'src/app/modals/asignar-agente/asignar-agente.component';
import { ApiService } from 'src/app/services/api.service';
import { SecureStorageService } from 'src/app/services/secure-storage.service';
import { ValidarRolesService } from 'src/app/services/validar-roles.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
  standalone: false
})
export class TicketPage implements OnInit {
  public estadosTickets: any = [];
  public ticketsAll: any[] = [];
  public filteredTickets: any[] = [];
  public idUsuario!: string;
  public nombreCompletoUsuario = '';
  public emailUsuario = '';
  public idRol!: number;
  public loading = false;
  public agentes: any[] = [];
  public departamentoAgentes: any = [];
  public displayModal = false;
  public searchTerm: string = '';
  public ticketForm: FormGroup = this.fb.group({
    idTicket: [],
    idDepartamentoA: [null, Validators.required],
    idAgente: [null, Validators.required],
    departamentoAgente: [null],
    agente: [null]
  });

  estadoSeleccionado = 'all';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private storage: SecureStorageService,
    public validarRol: ValidarRolesService,
    private modalCtrl: ModalController
  ) { }

  async ionViewWillEnter() {
    await this.validarRol.cargarDatos();

    this.validarRol.datosCargados$.subscribe(async cargado => {
      if (cargado) {
        this.validarRol.rol$.subscribe(idRol => {
          console.log('ROL DETECTADO:', idRol);
          // Aquí puedes hacer lógica específica según el rol
          this.cargarEstados();
          this.cargarDepartamentos();
          this.loadTickets();
        });
        this.idUsuario = await this.storage.get('idUsuario');
        const nombres = await this.storage.get('nombres');
        const apellidos = await this.storage.get('apellidos');
        this.nombreCompletoUsuario = `${nombres} ${apellidos}`;
        this.emailUsuario = await this.storage.get('email');

      }
    });
  }

  async ngOnInit() {
    this.idUsuario = await this.storage.get('idUsuario');
    this.idRol = await this.storage.get('idRol') || 0;
    this.loadTickets();
  }

  private async cargarEstados(): Promise<void> {
    const endpoint = 'controllers/estadoticket.controller.php?op=todos';
    const data = await (await this.apiService.get(endpoint)).toPromise();
    this.estadosTickets = data;
    console.log(this.estadosTickets)
  }

  private async cargarDepartamentos(): Promise<void> {
    const endpoint = 'controllers/departamentoagente.controller.php?op=todos';
    const data = await (await this.apiService.get(endpoint)).toPromise();
    this.departamentoAgentes = data;
    console.log(this.departamentoAgentes);
  }

  // async loadTickets() {
  //   this.loading = true;
  //   try {
  //     const data = await this.apiService.get<any[]>('controllers/ticket.controller.php?op=todos').toPromise() ?? [];
  //     this.ticketsAll = data.map((u) => ({
  //       idTicket: u.idTicket,
  //       idDepartamentoA: u.idDepartamentoA,
  //       idAgente: u.idAgente,
  //       titulo: u.titulo,
  //       descEstadoTicket: u.estadoTicketNombre || 'No proporcionado',
  //       fechaCreacion: u.fechaCreacion,
  //       fechaActualizacion: u.fechaAtualizacion,
  //       descPersona: `${u.personaNombres} ${u.personaApellidos}`,
  //       descPrioridad: u.prioridadNombre,
  //       descDepartamentoA: u.departamentoANombre,
  //       descAgente: u.agenteNombreCompleto,
  //       resueltoPrimerContacto: u.resueltoPrimerContacto,
  //       idEstadoTicket: u.idEstadoTicket,
  //       idEncuesta: u.idEncuesta,
  //     }));

  //     this.filteredTickets = this.ticketsAll.filter((ticket) => ticket.descEstadoTicket !== 'Cerrado');
  //   } catch (error) {
  //     console.error('Error al cargar tickets', error);
  //   } finally {
  //     this.loading = false;
  //   }
  // }

  // Método para filtrar tickets según el campo de búsqueda
  //   filtrarTicketsParam(filterType: any = 'all') {
  //   this.filteredTickets = this.ticketsAll.filter((ticket) => {
  //     // Filtrar por búsqueda en cualquier campo del ticket
  //     const matchesSearch = this.searchTerm
  //       ? Object.values(ticket).some((value) =>
  //           String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
  //         )
  //       : true;

  //     // Filtrar según el tipo de estado seleccionado
  //     const matchesFilter =
  //       filterType === 'all' ||
  //       (filterType === 'closed' && ticket.descEstadoTicket === 'Cerrado') ||
  //       (filterType === 'open' && ticket.descEstadoTicket !== 'Cerrado');

  //     return matchesSearch && matchesFilter;
  //   });
  // }

  filtrarTicketsParam() {
    const termino = this.searchTerm?.toLowerCase() || '';
    const estado = this.estadoSeleccionado;

    this.filteredTickets = this.ticketsAll.filter(ticket => {
      const coincideTermino =
        ticket.idTicket.toLowerCase().includes(termino) ||
        ticket.titulo.toLowerCase().includes(termino) ||
        ticket.descEstadoTicket?.toLowerCase().includes(termino) ||
        ticket.estadoTicketNombre?.toLowerCase().includes(termino);

      const coincideEstado =
        estado === 'all' || ticket.idEstadoTicket === estado;

      return coincideTermino && coincideEstado;
    });
  }

  getColorPorEstado(nombreEstado: string): string {
    switch (nombreEstado?.toLowerCase()) {
      case 'abierto':
        return 'warning';
      case 'asignado':
        return 'primary';
      case 'en progreso':
        return 'tertiary';
      case 'cerrado':
        return 'success';
      case 'reaperturado':
        return 'danger';
      case 'escalado':
        return 'secondary';
      default:
        return 'medium'; // color neutro
    }
  }

  async loadTickets() {
    this.loading = true;
    const idRol = await this.storage.get('idRol');
    const idUsuario = await this.storage.get('idUsuario');
    const token = await this.storage.get('token');

    console.log(`Valores obtenidos para la API - idRol: ${idRol}, idUsuario: ${idUsuario}, tooken: ${token}`);

    if (!idRol || !idUsuario) {
      console.error('No se encontró idRol o idUsuario, deteniendo carga de tickets.');
      this.loading = false;
      return;
    }
    try {
      const ticketsObservable = await this.apiService.getSinT<any[]>('controllers/ticket.controller.php?op=todos');
      const data = await lastValueFrom(ticketsObservable); // Convertir Observable a Promise
      console.log('Datos de tickets obtenidos:', data);

      this.ticketsAll = data.map((u) => ({
        idTicket: u.idTicket,
        idDepartamentoA: u.idDepartamentoA,
        idAgente: u.idAgente,
        titulo: u.titulo,
        descEstadoTicket: u.estadoTicketNombre || 'No proporcionado',
        fechaCreacion: u.fechaCreacion,
        fechaActualizacion: u.fechaAtualizacion,
        descPersona: `${u.personaNombres} ${u.personaApellidos}`,
        descPrioridad: u.prioridadNombre,
        descDepartamentoA: u.departamentoANombre,
        descAgente: u.agenteNombreCompleto,
        resueltoPrimerContacto: u.resueltoPrimerContacto,
        idEstadoTicket: u.idEstadoTicket,
        idEncuesta: u.idEncuesta,
        descripcion: u.descripcion
      }));

      this.filteredTickets = this.ticketsAll.filter(ticket => ticket.descEstadoTicket !== 'Cerrado');
    } catch (error) {
      console.error('Error al cargar tickets', error);
      this.showToast('Error al obtener los tickets.', 'danger');
    } finally {
      this.loading = false;
    }
  }

  filterTickets(filterType: string): void {
    if (filterType === 'closed') {
      this.filteredTickets = this.ticketsAll.filter((ticket) => ticket.descEstadoTicket === 'Cerrado');
    } else if (filterType === 'all') {
      this.filteredTickets = this.ticketsAll;
    } else {
      this.filteredTickets = this.ticketsAll.filter((ticket) => ticket.descEstadoTicket === 'Abierto');
    }
  }

  async confirmEliminar(ticket: any) {
    const ticketId = ticket.idTicket;
    if (!ticketId) {
      console.error('ID de ticket no proporcionado');
      return;
    }
    console.log(ticket)
    if (ticket.idEstadoTicket !== '1') {
      this.showToast('SOlo se puede eliminar un ticket abierto.', 'danger');
      return;
    }
    const alert = await this.alertController.create({
      header: 'Eliminar Ticket',
      message: `¿Estás seguro de eliminar el Ticket #${ticketId}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.eliminarTicket(ticketId) }
      ]
    });
    await alert.present();
  }

  async eliminarTicket(idTicket: string) {
    try {
      const loading = await this.loadingController.create({
        message: 'Eliminando ticket...',
        spinner: 'circles'
      });
      await loading.present();
      const formData = new FormData();
      formData.append('idTicket', idTicket);
      const data = await (await this.apiService.postFormData('controllers/ticket.controller.php?op=eliminar', formData)).toPromise();
      this.loadTickets();
      this.showToast('Ticket eliminado correctamente.', 'success');
    } catch (error) {
      console.error('Error al eliminar el ticket', error);
      this.showToast('No se pudo eliminar el ticket.', 'danger');
    } finally {
      this.loadingController.dismiss();
    }
  }

  crearNuevoTicket() {
    this.router.navigate(['/n-ticket']);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }

  async asignarAgente(ticket: any) {
    console.log(ticket)
    const modal = await this.modalCtrl.create({
      component: AsignarAgenteComponent,
      componentProps: {
        ticket,
        departamentoAgentes: this.departamentoAgentes,
        todosAgentes: this.agentes,
        opcion: 1 // Asignar
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data?.confirmado) {
      console.log(data)
      this.confirmarAsignarAgente(ticket, data);
    } else {
      this.showToast('Asignación cancelada.', 'warning');
      this.loadTickets();
      this.searchTerm = '';
      this.estadoSeleccionado = 'all';
    }
  }

  async editarTicket(ticket: any) {
    this.router.navigate(['/n-ticket', ticket.idTicket]);
  }

  async confirmarAsignarAgente(ticket: any, respuesta: any) {
    this.loading = true;
    const loading = await this.loadingController.create({
      message: 'Asignando agente...',
      spinner: 'circles'
    });
    try {
      await loading.present();
      const formData = new FormData();
      formData.append('idTicket', ticket.idTicket);
      formData.append('idDepartamentoA', respuesta.idDepartamentoA);
      formData.append('idAgente', respuesta.idAgente);
      formData.append('titulo', ticket.titulo);
      formData.append('nombreUsuario', this.nombreCompletoUsuario);
      formData.append('idEstadoTicket', '2');

      const data = await (await this.apiService.postFormData('controllers/ticket.controller.php?op=actualizaragente', formData)).toPromise();
      await loading.dismiss();;
      this.showToast('Agente asignado correctamente.', 'success');
      this.searchTerm = '';
      this.estadoSeleccionado = 'all';
      this.loadTickets();
    } catch (error) {
      console.error('Error asignando agente', error);
      this.showToast('No se pudo asignar el agente.', 'danger');
    } finally {
      this.loading = false;
      await loading.dismiss();
    }
  }

}
