import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Agente } from 'src/app/models/agente.model';
import { DepartamentoAgente } from 'src/app/models/departamentoAgente.model';
import { EstadoTicket } from 'src/app/models/estadoTicket.model';
import { Prioridad } from 'src/app/models/prioridad.model';
import { Sla } from 'src/app/models/sla.model';
import { TemaAyuda } from 'src/app/models/temaAyuda.model';
import { Ticket } from 'src/app/models/ticket.model';
import { ApiService } from 'src/app/services/api.service';
import { SecureStorageService } from 'src/app/services/secure-storage.service';
import { ValidarRolesService } from 'src/app/services/validar-roles.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.page.html',
  styleUrls: ['./new-ticket.page.scss'],
  standalone: false,
})
export class NewTicketPage implements OnInit {
  public ticketForm!: FormGroup;
  public ticket: any;
  public prioridades: Prioridad[] = [];
  public slas: Sla[] = [];
  public departamentoAgentes: DepartamentoAgente[] = [];
  public agentes: Agente[] = [];
  public estadoTickets: EstadoTicket[] = [];
  public temasAyuda: TemaAyuda[] = [];
  public userInfo: any;
  public idUsuario: string = '';
  public nombreCompletoUsuario = '';
  public emailUsuario: any = '';
  public idRol: any = '';
  public loading: boolean = false;
  public operation = 'op=insertar';
  public isEdicion = false;
  public estadoTicketId: string = '1'; // Valor predeterminado inicial Ticket - Abierto = 1
  public prioridadId: string = '1'; // Valor predeterminado inicial Prioridad - Normal = 1
  public slaId: string = '1'; // Valor predeterminado inicial SLA - 1hora = 1
  public temaAyudaId: string = '1';
  public fuenteContactoId: string = '1';
  public resueltoPrimerContacto: number = 0;
  public rolListo: boolean = true;

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private storage: SecureStorageService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public validarRol: ValidarRolesService,
    private http: HttpClient,
  ) {
  }

  async ionViewWillEnter() {
    await this.validarRol.cargarDatos(); // espera la carga
    this.rolListo = true;
    await this.loadData();               // carga entidades si es necesario
  }

  async ngOnInit() {
    // await this.validarRol.cargarDatos();
    // this.rolListo = this.validarRol.datosCargados$;
    // console.log('valor de metodo es usuario   ' +this.validarRol.esUsuario());
    // console.log('rolListo:', this.rolListo);
    const cargados = await this.validarRol.datosCargados$;
    if (cargados) {
      this.rolListo = true;
      this.ticketForm = this.fb.group({
        idTicket: [null],
        estadoTicket: [null, Validators.required],
        titulo: ['', Validators.required],
        descripcion: ['', Validators.required],

        departamentoAgente: [null, Validators.required],
        agente: [null, Validators.required],
        prioridad: [null, Validators.required],
        sla: [
          ,
          this.validarRol.esAdministrador() ||
            this.validarRol.esAgente() ||
            this.validarRol.esCoordinador()
            ? Validators.required
            : null,
        ],
        temaAyuda: [null, Validators.required],
        estadoTicketNombre: []
      });

      await this.loadData();

      this.activatedRoute.params.subscribe(async (params) => {
        const idTicket = params['codigo'];
        if (idTicket) {
          await this.getTicket(idTicket);
          this.operation = 'op=actualizar';
          this.isEdicion = true;
        } else {
          this.ticket = new Ticket();
          console.log('Creando nuevo ticket');
          this.ticketForm.patchValue({
            estadoTicket: 1,
          });
          this.operation = 'op=insertar';
          this.formTicket({
            idTicket: '',
            titulo: '',
            descripcion: '',
            idSla: this.slaId,
            idPrioridad: this.prioridadId,
            idDepartamentoA: '',
            idEstadoTicket: this.estadoTicketId,
            idAgente: '',
            idUsuario: this.idUsuario,
            resueltoPrimerContacto: this.resueltoPrimerContacto,
            idTemaAyuda: this.temaAyudaId,
            idfuenteContacto: this.fuenteContactoId,
            fechaInicioAtencion: '',
            fechaAtualizacion: '',
            fechaCreacion: '',
            emailUsuario: this.emailUsuario,
            nombreUsuario: this.nombreCompletoUsuario,
          });
        }
      });
    }
  }

  public async loadData(): Promise<void> {
    try {
      await this.validarRol.cargarDatos();
      if (this.validarRol.datosCargados$) {
        this.rolListo = true;
        console.log('Datos cargados:', this.validarRol.datosCargados$);
        this.loading = true;

        const entitiesToLoad: {
          endpoint: string;
          assign: (data: any[]) => void;
          label: string;
        }[] = [
            {
              endpoint: 'controllers/sla.controller.php?op=todos',
              assign: (data) => (this.slas = data.map(d => ({ ...d, nombreCompleto: d.nombre }))),
              label: 'nombre'
            },
            {
              endpoint: 'controllers/prioridad.controller.php?op=todos',
              assign: (data) => (this.prioridades = data.map(d => ({ ...d, nombreCompleto: d.nombre }))),
              label: 'nombre'
            },
            {
              endpoint: 'controllers/departamentoagente.controller.php?op=todos',
              assign: (data) => (this.departamentoAgentes = data.map(d => ({ ...d, nombreCompleto: d.nombre }))),
              label: 'nombre'
            },
            {
              endpoint: 'controllers/estadoticket.controller.php?op=todos',
              assign: (data) => (this.estadoTickets = data.map(d => ({ ...d, nombreCompleto: d.nombre }))),
              label: 'nombre'
            },
            {
              endpoint: 'controllers/temaayuda.controller.php?op=todos',
              assign: (data) => (this.temasAyuda = data.map(d => ({ ...d, nombreCompleto: d.nombre }))),
              label: 'nombre'
            }
          ];

        for (const entity of entitiesToLoad) {
          const response = await (await this.apiService.get(entity.endpoint)).toPromise();
          if (Array.isArray(response)) {
            entity.assign(response);
          }

        }
      } else {
        console.log('Datos no cargados:', this.validarRol.datosCargados$);
      }

      // Obtener info del usuario desde SecureStorage
      this.idUsuario = await this.storage.get('idUsuario');
      const nombres = await this.storage.get('nombres');
      const apellidos = await this.storage.get('apellidos');
      this.nombreCompletoUsuario = `${nombres} ${apellidos}`;
      this.emailUsuario = await this.storage.get('email');
    } catch (error: any) {
      this.showToast(error.message || 'Error cargando datos', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async fechaInicioAtencion(ticket: any) {
    const confirmar = await this.alertController.create({
      header: 'Iniciar Atención',
      message: `¿Deseas iniciar la atención del ticket #${ticket.idTicket}?`,
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Sí',
          handler: async () => {
            const now = new Date().toISOString();
            this.ticketForm.patchValue({
              fechaInicioAtencion: now,
              idEstadoTicket: '3'
            });
            //await this.guardarTicket();
          }
        }
      ]
    });

    await confirmar.present();
  }

  async onDepartamentoChange(event: any) {
    const idDepartamento = event.detail.value.idDepartamentoA;
    console.log("id departamento: " + idDepartamento);

    this.getAgentes(idDepartamento);
  }

  async getAgentes(idDepartamento: any) {
    try {
      const respuesta: any = await (await this.apiService.get(
        `/controllers/agente.controller.php?op=todosByDepartamento&idDepartamentoA=${idDepartamento}`
      )).toPromise();

      console.log('Agentes recibidos:', respuesta);

      this.agentes = Array.isArray(respuesta) ? respuesta : [];
    } catch (error) {
      console.error('Error cargando agentes:', error);
      this.agentes = [];
    }
  }

  async getTicket(idTicket: string) {
    try {
      this.loading = true;

      const ticketData = {
        idTicket: idTicket
      };
      const formData = this.apiService.createFormData(ticketData);

      const response = await (await this.apiService.postData(formData, 'op=uno')).toPromise();
      // const response: any = await (await this.apiService.get(`controllers/ticket.controller.php?op=uno&idTicket=${idTicket}`)).toPromise();

      console.log('Ticket recibido:', response);

      // Buscar y asignar objetos completos a los selectores
      // const slaSeleccionada = this.slas.find(s => s.idSla == response.idSla);
      // const prioridadSeleccionada = this.prioridades.find(p => p.idPrioridad == response.idPrioridad);
      // const departamentoSeleccionado = this.departamentoAgentes.find(d => d.idDepartamentoA == response.idDepartamentoA);
      // const temaAyudaSeleccionado = this.temasAyuda.find(t => t.idTemaAyuda == response.idTemaAyuda);
      // const estadoTicketSeleccionado = this.estadoTickets.find(e => e.idEstadoTicket == response.idEstadoTicket);

      // let agenteSeleccionado: any | null = null;
      // if (departamentoSeleccionado) {
      //   const agentes: any = await (await this.apiService.get(`controllers/agente.controller.php?op=todosByDepartamento&idDepartamentoA=${departamentoSeleccionado.idDepartamentoA}`)).toPromise();
      //   this.agentes = agentes;
      //   agenteSeleccionado = this.agentes.find(a => a.idAgente == response.idAgente);
      // }

      // this.ticketForm.patchValue({
      //   idTicket: response.idTicket,
      //   titulo: response.titulo,
      //   descripcion: response.descripcion,
      //   nombreUsuario: response.personaNombres + response.personaApellidos,
      //   emailUsuario: response.email,
      //   departamentoAgente: departamentoSeleccionado,
      //   agente: agenteSeleccionado,
      //   prioridad: prioridadSeleccionada,
      //   sla: slaSeleccionada,
      //   temaAyuda: temaAyudaSeleccionado,
      //   estadoTicketNombre: response.estadoTicketNombre,
      //   estadoTicket: estadoTicketSeleccionado
      // });

      // this.ticket = response;
      // this.ticket.nombreUsuario = response.personaNombres + response.personaApellidos;
      // this.ticket.emailUsuario = response.email;
      await this.formTicket(response);

    } catch (error) {
      console.error('Error al obtener el ticket:', error);
      this.showToast('No se pudo cargar el ticket.', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async confirmGuardar() {
    const esActualizar = this.operation === 'op=actualizar';
    const alert = await this.alertController.create({
      header: esActualizar ? 'Actualizar Ticket' : 'Crear Ticket',
      message: esActualizar
        ? '¿Desea actualizar la información del ticket?'
        : '¿Desea guardar el nuevo ticket?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: () => this.guardarTicket(),
        },
      ],
    });
    await alert.present();
  }


  async guardarTicket(): Promise<void> {
    console.log(this.ticketForm.value)
    if (this.ticketForm.invalid) {
      this.showToast('Por favor complete los campos obligatorios.', 'danger');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando...',
    });
    await loading.present();

    try {
      const formValue = this.ticketForm.value;

      // Obtener fecha actual formateada
      const now = new Date().toISOString();

      // Preparar estructura para el FormData
      let ticketData: any = {};
      // if (this.isEdicion) {
      //   formValue.idTicket = this.ticket.idTicket;
      // } else {

      console.log(formValue)

      ticketData = {
        idTicket: formValue.idTicket || '',
        titulo: formValue.titulo,
        descripcion: formValue.descripcion,
        idDepartamentoA: formValue.departamentoAgente?.idDepartamentoA || '',
        idAgente: formValue.agente?.idAgente || '',
        idPrioridad: formValue.prioridad?.idPrioridad || '',
        idSla: formValue.sla?.idSla || '',
        idUsuario: this.idUsuario,
        idfuenteContacto: formValue.idfuenteContacto || '1',
        idTemaAyuda: formValue.temaAyuda?.idTemaAyuda || '1',
        resueltoPrimerContacto: '0',
        idEstadoTicket: '1', // Estado inicial: Abierto
        emailUsuario: this.emailUsuario || '',
        nombreUsuario: this.nombreCompletoUsuario || '',

        // Fechas requeridas
        fechaCreacion: now,
        fechaInicioAtencion: formValue.fechaInicioAtencion,
        fechaPrimeraRespuesta: formValue.fechaPrimeraRespuesta,
        fechaAtualizacion: formValue.fechaAtualizacion,
        fechaReapertura: formValue.fechaReapertura,
        fechaUltimaRespuesta: formValue.fechaUltimaRespuesta,
        fechaCierre: formValue.fechaCierre,
      };
      // }

      const formData = this.apiService.createFormData(ticketData);

      const response = await (await this.apiService.postData(formData, this.operation)).toPromise();
      console.log('Respuesta del servidor:', response);

      this.showToast('Ticket creado exitosamente.', 'success');
      this.ticketForm.reset();

    } catch (error) {
      console.error('Error al crear ticket:', error);
      this.showToast('Error al crear el ticket.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  ////
  private async formTicket(data: any) {
    let idUsuarioT: any = this.idUsuario;
    let estadoTicketNombre = '';
    const {
      idTicket,
      titulo,
      descripcion,
      idSla,
      idPrioridad,
      idDepartamentoA,
      idEstadoTicket,
      idAgente,
      resueltoPrimerContacto,
      idfuenteContacto,
      idTemaAyuda,
      fechaAtualizacion,
      fechaInicioAtencion,
      fechaCreacion,
      fechaPrimeraRespuesta,
      fechaReapertura,
      // personaNombres,
      // personaApellidos,
      // emailUsuario,
      // nombreUsuario
    } = data;
    this.ticket = new Ticket();
    this.isEdicion = !!idTicket;
    console.log(data)

    if (idTicket) {
      this.nombreCompletoUsuario = data.personaNombres + ' ' + data.personaApellidos;
      this.emailUsuario = data.email;
      idUsuarioT = data.idUsuario;
      estadoTicketNombre = data.estadoTicketNombre;
    } else {
      this.nombreCompletoUsuario = this.nombreCompletoUsuario;
      this.emailUsuario = this.emailUsuario;
    }

    // 1 Administrador, 2 Usuario, 3 Agente, 4 Coordinador
    this.ticketForm = this.fb.group({
      idTicket: [idTicket],
      emailUsuario: [this.emailUsuario],
      nombreUsuario: [this.nombreCompletoUsuario],
      estadoTicketNombre: [estadoTicketNombre],
      titulo: [
        titulo,
        this.validarRol.esAdministrador() || this.validarRol.esUsuario()
          ? Validators.required
          : null,
      ],
      descripcion: [
        descripcion,
        this.validarRol.esAdministrador() || this.validarRol.esUsuario()
          ? Validators.required
          : null,
      ],
      idSla: [idSla],
      idPrioridad: [idPrioridad],
      idDepartamentoA: [idDepartamentoA],
      idEstadoTicket: [idEstadoTicket],
      idAgente: [idAgente],
      idfuenteContacto: [idfuenteContacto],
      resueltoPrimerContacto: [resueltoPrimerContacto],
      idUsuario: [idUsuarioT], // Inicio obligatoria
      idTemaAyuda: [idTemaAyuda],
      temaAyuda: [idTemaAyuda],
      sla: [
        idSla,
        this.validarRol.esAdministrador() ||
          this.validarRol.esAgente() ||
          this.validarRol.esCoordinador()
          ? Validators.required
          : null,
      ],
      prioridad: [
        idPrioridad,
        this.validarRol.esAdministrador() ||
          this.validarRol.esAgente() ||
          this.validarRol.esCoordinador()
          ? Validators.required
          : null,
      ],
      departamentoAgente: [
        idDepartamentoA,
        this.validarRol.esAdministrador() ||
          this.validarRol.esAgente() ||
          this.validarRol.esCoordinador()
          ? Validators.required
          : null,
      ],
      estadoTicket: [
        idEstadoTicket,
        this.validarRol.esAdministrador() ||
          this.validarRol.esAgente() ||
          this.validarRol.esCoordinador()
          ? Validators.required
          : null,
      ],
      agente: [
        idAgente,
        this.validarRol.esAdministrador() ||
          this.validarRol.esAgente() ||
          this.validarRol.esCoordinador()
          ? Validators.required
          : null,
      ],
      fechaAtualizacion: [fechaAtualizacion],
      fechaInicioAtencion: [fechaInicioAtencion],
      fechaCreacion: [fechaCreacion],
      fechaPrimeraRespuesta: [fechaPrimeraRespuesta],
      fechaReapertura: [fechaReapertura]
    });
    // Escuchar cambios en el selector de SLA y actualizar idSla
    const slaControl = this.ticketForm.get('sla');
    if (slaControl) {
      slaControl.valueChanges.subscribe((sla) => {
        const slaId = sla?.idSla || sla;
        this.ticketForm.get('idSla')!.setValue(slaId);
      });
    }
    const slaSeleccionada = this.slas.find((sla) => sla.idSla == idSla);
    this.ticketForm.get('sla')!.setValue(slaSeleccionada);

    // Escuchar cambios en el selector de Tema de Ayuda y actualizar idTemaAyuda
    const temaAyudaControl = this.ticketForm.get('temaAyuda');
    if (temaAyudaControl) {
      temaAyudaControl.valueChanges.subscribe((temaAyuda) => {
        const temaAyudaId = temaAyuda?.idTemaAyuda || temaAyuda;
        this.ticketForm.get('idTemaAyuda')!.setValue(temaAyudaId);
      });
    }
    const temAyudaSeleccionada = this.temasAyuda.find(
      (temaAyuda) => temaAyuda.idTemaAyuda == idTemaAyuda
    );
    this.ticketForm.get('temaAyuda')!.setValue(temAyudaSeleccionada);

    // Escuchar cambios en el selector de Prioridad y actualizar idPrioridad
    this.ticketForm.get('prioridad')!.valueChanges.subscribe((prioridad) => {
      const prioridadId = prioridad?.idPrioridad || prioridad;
      this.ticketForm.get('idPrioridad')!.setValue(prioridadId);
    });
    const prioridadSeleccionada = this.prioridades.find(
      (prioridad) => prioridad.idPrioridad == idPrioridad
    );
    this.ticketForm.get('prioridad')!.setValue(prioridadSeleccionada);

    // Escuchar cambios en el selector de DepartamentoAgente y actualizar idDepartamentoA
    this.ticketForm
      .get('departamentoAgente')!
      .valueChanges.subscribe((departamentoAgente) => {
        const departamentoAgenteId =
          departamentoAgente?.idDepartamentoA || departamentoAgente;
        this.ticketForm
          .get('idDepartamentoA')!
          .setValue(departamentoAgenteId);
      });
    const departamentoAgenteSeleccionado = this.departamentoAgentes.find(
      (departamentoAgente) =>
        departamentoAgente.idDepartamentoA == idDepartamentoA
    );
    this.ticketForm
      .get('departamentoAgente')!
      .setValue(departamentoAgenteSeleccionado);

    // Escuchar cambios en el selector de estadoTicket y actualizar idEstadoTicket
    this.ticketForm
      .get('estadoTicket')!
      .valueChanges.subscribe((estadoTicket) => {
        const estadoTicketId =
          estadoTicket?.idEstadoTicket || estadoTicket;
        this.ticketForm.get('idEstadoTicket')!.setValue(estadoTicketId);
      });
    const estadoTicketSeleccionada = this.estadoTickets.find(
      (estadoTicket) => estadoTicket.idEstadoTicket == idEstadoTicket
    );
    this.ticketForm.get('estadoTicket')!.setValue(estadoTicketSeleccionada);
    // Verificar si ya existe un departamento al cargar el formulario
    // let agenteSeleccionado: any | null = null;
    // if (idDepartamentoA) {
    //   this.getAgentesId(idDepartamentoA).subscribe((agentes) => {
    //     this.agentes = agentes;
    //     console.log(this.agentes);
    //     console.log(idDepartamentoA + "  id agente " + idAgente)
    //     agenteSeleccionado = this.agentes.find(
    //       (agente) => agente.idAgente == idAgente
    //     );
    //   });
    // }
    let agenteSeleccionado: any | null = null;
    if (idDepartamentoA) {
      const agentes: any = await (await this.apiService.get(`controllers/agente.controller.php?op=todosByDepartamento&idDepartamentoA=${idDepartamentoA}`)).toPromise();
      this.agentes = agentes;
      agenteSeleccionado = this.agentes.find(a => a.idAgente == idAgente);
    }

    console.log(agenteSeleccionado)
    this.ticketForm.get('agente')!.setValue(agenteSeleccionado);

    // Escuchar cambios en el selector de Agente y actualizar idAgente
    this.ticketForm.get('agente')!.valueChanges.subscribe((agente) => {
      const agenteId = agente?.idAgente || agente;
      this.ticketForm.get('idAgente')!.setValue(agenteId);
    });

    console.log(this.ticketForm.value)
    this.ticket = this.ticketForm.value as Ticket;
    return this.ticketForm;
  }
  ////

  private agenteApi = `${environment.apiUrl}/controllers/agente.controller.php?op=todosByDepartamento`;
  getAgentesId(idDepartamentoA: any): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.agenteApi}&idDepartamentoA=${idDepartamentoA}`
    );
  }

  async confirmCancelar() {
    const alert = await this.alertController.create({
      header: 'Cancelar',
      message: '¿Desea cancelar la creación del ticket?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => history.back()
        }
      ]
    });
    await alert.present();
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color
    });
    toast.present();
  }

}
