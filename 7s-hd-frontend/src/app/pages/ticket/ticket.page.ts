import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
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
  public ticketsAll: any[] = [];
  public filteredTickets: any[] = [];
  public idUsuario!: string;
  public idRol!: number;
  public loading = false;
  public agentes: any[] = [];
  public departamentoAgentes: any[] = [];
  public displayModal = false;
  public searchTerm: string = '';
  // public ticketForm!: FormGroup;
  public ticketForm: FormGroup = this.fb.group({
    idTicket: [],
    idDepartamentoA: [null, Validators.required],
    idAgente: [null, Validators.required],
    departamentoAgente: [null],
    agente: [null]
  });

  constructor(
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private storage: SecureStorageService,
    public validarRol: ValidarRolesService,
  ) { }

  // async ionViewWillEnter() {
  //   await this.validarRol.cargarDatos();
  //   console.log('Rol cargado:', this.validarRol.idRol); // Verifica que ya esté cargado
  // }

  async ionViewWillEnter() {
    await this.validarRol.cargarDatos();

    this.validarRol.datosCargados$.subscribe(cargado => {
      if (cargado) {
        this.validarRol.rol$.subscribe(idRol => {
          console.log('ROL DETECTADO:', idRol);
          // Aquí puedes hacer lógica específica según el rol
        });
      }
    });
  }

  esUsuario() {
    return this.validarRol.esUsuario();
  }

  async ngOnInit() {
    this.idUsuario = await this.storage.get('idUsuario');
    this.idRol = await this.storage.get('idRol') || 0;
    this.loadTickets();

    // this.ticketForm = this.fb.group({
    //   idTicket: [],
    //   idDepartamentoA: [],
    //   idAgente: [],
    //   departamentoAgente: [null, Validators.required],
    //   agente: [null, Validators.required],
    // });
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
  filtrarTicketsParam(filterType: any = 'all') {
  this.filteredTickets = this.ticketsAll.filter((ticket) => {
    // Filtrar por búsqueda en cualquier campo del ticket
    const matchesSearch = this.searchTerm
      ? Object.values(ticket).some((value) =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      : true;

    // Filtrar según el tipo de estado seleccionado
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'closed' && ticket.descEstadoTicket === 'Cerrado') ||
      (filterType === 'open' && ticket.descEstadoTicket !== 'Cerrado');

    return matchesSearch && matchesFilter;
  });
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

  async confirmEliminar(ticketId: string) {
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
    // try {
    //   await this.apiService.post('controllers/ticket.controller.php?op=eliminar', { idTicket }).toPromise();
    //   this.loadTickets();
    //   this.showToast('Ticket eliminado correctamente.', 'success');
    // } catch (error) {
    //   console.error('Error al eliminar el ticket', error);
    //   this.showToast('No se pudo eliminar el ticket.', 'danger');
    // }
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
    this.displayModal = true;
    this.ticketForm.patchValue({
      idTicket: ticket.idTicket,
      idDepartamentoA: ticket.idDepartamentoA,
      idAgente: ticket.idAgente,
    });

  //   try {
  //     const agentesResponse = await this.apiService.get<any[]>('controllers/agente.controller.php?op=todosByDepartamento', {
  //       idDepartamentoA: ticket.idDepartamentoA
  //     }).toPromise();

  //     this.agentes = agentesResponse ?? [];
  //     // this.agentes = await this.apiService.get<any[]>('controllers/agente.controller.php?op=todosByDepartamento', {
  //     //   idDepartamentoA: ticket.idDepartamentoA
  //     // }).toPromise();

  //     const departamentoAgenteResponse = await this.apiService.get<any[]>('controllers/departamentoagente.controller.php?op=todos')
  //       .toPromise();
  //     this.departamentoAgentes = departamentoAgenteResponse ?? [];
  //     // this.departamentoAgentes = await this.apiService.get<any[]>('controllers/departamentoagente.controller.php?op=todos')
  //     // .toPromise();
  //   } catch (error) {
  //     console.error('Error cargando agentes y departamentos', error);
  //   }
  }

  async editarTicket(ticket: any) {
    this.router.navigate(['/n-ticket', ticket.idTicket]);
  }

  async confirmarAsignarAgente() {
    if (!this.ticketForm.valid) {
      this.showToast('Complete los campos obligatorios.', 'danger');
      return;
    }

    this.loading = true;
    // try {
    //   await this.apiService.post('controllers/ticket.controller.php?op=actualizaragente', this.ticketForm.value).toPromise();
    //   this.loadTickets();
    //   this.displayModal = false;
    //   this.showToast('Agente asignado correctamente.', 'success');
    // } catch (error) {
    //   console.error('Error asignando agente', error);
    //   this.showToast('No se pudo asignar el agente.', 'danger');
    // } finally {
    //   this.loading = false;
    // }
  }
}
