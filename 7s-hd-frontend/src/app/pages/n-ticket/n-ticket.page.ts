import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Ticket } from 'src/app/models/ticket.model';
import { ApiService } from 'src/app/services/api.service';
import { SecureStorageService } from 'src/app/services/secure-storage.service';
import { ValidarRolesService } from 'src/app/services/validar-roles.service';
import { AsignarAgenteComponent } from 'src/app/modals/asignar-agente/asignar-agente.component';
import { ChatComponent } from 'src/app/modals/chat/chat.component';

@Component({
  selector: 'app-n-ticket',
  templateUrl: './n-ticket.page.html',
  styleUrls: ['./n-ticket.page.scss'],
  standalone: false,
})
export class NTicketPage {
  public ticketForm!: FormGroup;
  public ticket: any = null;
  public prioridades: any[] = [];
  public slas: any[] = [];
  public departamentoAgentes: any[] = [];
  public agentes: any[] = [];
  public estadoTickets: any[] = [];
  public temasAyuda: any[] = [];

  public idUsuario = '';
  public nombreCompletoUsuario = '';
  public emailUsuario = '';
  public operation = 'op=insertar';
  public isEdicion = false;
  public loading = true;
  public mensaje = 'Ticket guardado correctamente.';
  public editable: boolean = false;
  public estadoTicket: string = '1';
  html: SafeHtml = '<p>Some HTML</p>';
  // public detalleSeguro: SafeHtml;
  // public detalleSeguro: any;
  public detalleSeguro: SafeHtml = this.sanitizer.bypassSecurityTrustHtml('');
  public mensajes: any = [];
  public ticketDetalleForm!: FormGroup;
  public ticketDetalle: any = null;


  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private storage: SecureStorageService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public validarRol: ValidarRolesService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    if (this.isEdicion && this.ticket?.descripcion) {
      this.detalleSeguro = this.sanitizer.bypassSecurityTrustHtml(this.ticket.descripcion);
    }
  }

  public async ionViewWillEnter() {
    await this.validarRol.cargarDatos();
    this.validarRol.datosCargados$.subscribe(async cargado => {
      if (cargado) {
        this.validarRol.rol$.subscribe(idRol => {
          console.log('ROL DETECTADO:', idRol);
          // Aquí puedes hacer lógica específica según el rol
        });
        this.idUsuario = await this.storage.get('idUsuario');
        const nombres = await this.storage.get('nombres');
        const apellidos = await this.storage.get('apellidos');
        this.nombreCompletoUsuario = `${nombres} ${apellidos}`;
        this.emailUsuario = await this.storage.get('email');
        await this.cargaInicial();
      }
    });
  }

 public async abrirChat() {
    console.log(this.ticket)
    const modal = await this.modalCtrl.create({
      component: ChatComponent,
      componentProps: {
        ticket: this.ticket,
        usuario: this.idUsuario,
        tipoDetalle: 0 // Agente
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data?.confirmado) {
      console.log(data)
      
    } else {
      this.showToast('Registro del mensaje cancelado.', 'warning');
    }
  }

  private async cargaInicial() {
    try {
      await this.cargarListas();
      await this.inicializarFormulario();
      await this.inicializarDetalle();

      this.activatedRoute.params.subscribe(async (params) => {
        const idTicket = params['codigo'];
        if (idTicket) {
          this.operation = 'op=actualizar';
          this.isEdicion = true;
          await this.cargarTicket(idTicket);
        } else {
          this.operation = 'op=insertar';
          this.configurarFormularioNuevo();
        }
        this.loading = false;
      });
    } catch (error) {
      this.showToast('Error al iniciar ticket', 'danger');
      this.loading = false;
    }
  }

  private async cargarListas(): Promise<void> {
    const entidades = [
      { endpoint: 'controllers/sla.controller.php?op=todos', key: 'slas' },
      { endpoint: 'controllers/prioridad.controller.php?op=todos', key: 'prioridades' },
      { endpoint: 'controllers/departamentoagente.controller.php?op=todos', key: 'departamentoAgentes' },
      { endpoint: 'controllers/estadoticket.controller.php?op=todos', key: 'estadoTickets' },
      { endpoint: 'controllers/temaayuda.controller.php?op=todos', key: 'temasAyuda' },
    ];

    for (const entidad of entidades) {
      const data = await (await this.apiService.get(entidad.endpoint)).toPromise();
      if (Array.isArray(data)) {
        (this as any)[entidad.key] = data;
      }
    }
  }

  private async inicializarDetalle() {
    this.ticketDetalleForm = this.fb.group({
      idTicketDetalle: [null],
      idTicket: [null],
      idAgente: [
        this.validarRol.esUsuario()
          ? null
          : this.ticketForm.get('idAgente')?.value,
      ],
      idDepartamentoA: [
        this.ticketForm.get('idDepartamentoA')?.value,
      ],
      detalle: ['', Validators.required],
      fechaDetalle: [],
      tipoDetalle: [],
      observacion: [],
    });
  }

  private async inicializarFormulario() {
    this.ticketForm = this.fb.group({
      idTicket: [null],
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],

      departamentoAgente: [null, this.validarRol.esAdministrador() || this.validarRol.esCoordinador() ? Validators.required : null],
      agente: [null, this.validarRol.esAdministrador() || this.validarRol.esCoordinador() ? Validators.required : null],
      idAgente: [null],
      prioridad: [null, this.validarRol.esAdministrador() || this.validarRol.esAgente() ? Validators.required : null],
      sla: [null, this.validarRol.esAdministrador() || this.validarRol.esAgente() ? Validators.required : null],
      temaAyuda: [null, Validators.required],
      idEstadoTicket: [null],
      estadoTicket: [null],
      estadoTicketNombre: [''],
      emailUsuario: [this.emailUsuario],
      nombreUsuario: [this.nombreCompletoUsuario],
      fechaCreacion: [''],
      fechaAtualizacion: [''],
      fechaInicioAtencion: [''],
      fechaReapertura: [''],
      fechaPrimeraRespuesta: [''],
      fechaUltimaRespuesta: [''],
      fechaCierre: ['']
    });

    this.ticketForm.get('departamentoAgente')?.valueChanges.subscribe(dep => {
      const id = dep?.idDepartamentoA || dep;
      this.ticketForm.get('idDepartamentoA')?.setValue(id);
      this.getAgentes(id);
    });

    this.ticketForm.get('agente')?.valueChanges.subscribe(agente => {
      const id = agente?.idAgente || agente;
      this.ticketForm.get('idAgente')?.setValue(id);
    });
  }

  private configurarFormularioNuevo() {
    this.editable = true;
    this.ticketForm.patchValue({
      estadoTicket: this.estadoTickets.find(e => e.idEstadoTicket === 1),
      prioridad: this.prioridades.find(p => Number(p.idPrioridad) === 1),
      sla: this.slas.find(s => s.idSla === '1'),
      temaAyuda: this.temasAyuda[0],
      idEstadoTicket: 1
    });
    this.ticket = {};
  }

  private async cargarTicket(idTicket: string) {
    try {
      const formData = new FormData();
      formData.append('idTicket', idTicket);
      // formData.append('titulo', this.ticketForm.value.titulo);
      // formData.append('descripcion', this.ticketForm.value.descripcion); // ya es HTML generado por ngx-quill
      const data = await (await this.apiService.postData(formData, 'op=uno')).toPromise();

      const sla = this.slas.find(s => s.idSla == data.idSla);
      const prioridad = this.prioridades.find(p => p.idPrioridad == data.idPrioridad);
      const depto = this.departamentoAgentes.find(d => d.idDepartamentoA == data.idDepartamentoA) || null;
      const tema = this.temasAyuda.find(t => t.idTemaAyuda == data.idTemaAyuda);
      const estado = this.estadoTickets.find(e => e.idEstadoTicket == data.idEstadoTicket);
      this.estadoTicket = data.idEstadoTicket;

      this.ticket = data; // am
      // sanitizar el HTML enriquecido del campo descripcion
      // this.detalleSeguro = this.sanitizer.bypassSecurityTrustHtml(data.descripcion); //am
      this.html = this.sanitizer.bypassSecurityTrustHtml(this.ticket.descripcion);

      let agentes: any = [];
      if (depto) {
        agentes = await (await this.apiService.get(`controllers/agente.controller.php?op=todosByDepartamento&idDepartamentoA=${depto.idDepartamentoA}`)).toPromise();
        this.agentes = agentes;
      }
      const agente = this.agentes.find(a => a.idAgente === data.idAgente) || null;

      this.ticketForm.patchValue({
        ...data,
        sla,
        prioridad,
        departamentoAgente: depto,
        idAgente: data.idAgente,
        agente: agente,
        temaAyuda: tema,
        estadoTicket: estado,
        emailUsuario: data.email,
        nombreUsuario: `${data.personaNombres} ${data.personaApellidos}`
      });

      this.ticket = data;
      if (this.estadoTicket == '3' || this.estadoTicket == '6' || this.estadoTicket == '9') {
        this.editable = true;
      }

      if (this.ticket) {
        try {
          const idTicket = this.ticket.idTicket;
          const detalles: any = await (await this.apiService.get(`controllers/ticketdetalle.controller.php?op=todos&idTicket=${idTicket}`)).toPromise();
          console.log(detalles);
          this.ticketDetalle = detalles;
          this.mensajes = this.ticketDetalle.map((mensaje: any) => ({
            ...mensaje,
            detalleSeguro: this.sanitizer.bypassSecurityTrustHtml(mensaje.detalle)
          }));
          this.mensajes.sort((a: any, b: any) => new Date(a.fechaDetalle).getTime() - new Date(b.fechaDetalle).getTime());
          console.log(this.mensajes)

        } catch (err) {
          // this.agentes = [];
        }
        // this.ticketDetalle = await (await this.apiService.postData(formData, 'op=detalle')).toPromise();
      }
    } catch (error) {
      this.showToast('Error al cargar el ticket', 'danger');
    }
  }

  async onDepartamentoChange(event: any) {
    const idDepartamento = event.detail.value.idDepartamentoA;

    this.getAgentes(idDepartamento);
  }

  async getAgentes(idDepartamento: number) {
    try {
      const agentes: any = await (await this.apiService.get(`controllers/agente.controller.php?op=todosByDepartamento&idDepartamentoA=${idDepartamento}`)).toPromise();
      this.agentes = agentes;
    } catch (err) {
      this.agentes = [];
    }
  }

  async onAgenteChange(event: any) {
    const idAgente = event.detail.value;
    const agente = this.agentes.find(a => a.idAgente === idAgente) || null;
    this.ticketForm.get('agente')?.setValue(agente);
  }

  async confirmGuardar() {
    const alerta = await this.alertController.create({
      header: this.isEdicion ? 'Actualizar Ticket' : 'Crear Ticket',
      message: '¿Desea continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Aceptar', handler: () => this.guardarTicket(this.mensaje) }
      ]
    });
    await alerta.present();
  }

  async guardarTicket(mensaje: string) {
    if (this.ticketForm.invalid) {
      this.showToast('Complete todos los campos obligatorios.', 'warning');
      return;
    }

    // Validar tamaño del contenido del campo descripcion
    const html = this.ticketForm.value.descripcion;
    const sizeInKB = new Blob([html]).size / 1024;
    const imgCount = (html.match(/<img[^>]*>/g) || []).length;

    if (sizeInKB > 60000) {
      let msg = 'El contenido del detalle es demasiado grande. ';
      if (imgCount > 0) {
        msg += 'Posiblemente debido a imágenes muy pesadas. Por favor, reduzca su tamaño o cantidad.';
      } else {
        msg += 'Por favor, reduzca el texto o divida el contenido en varios tickets.';
      }

      this.showToast(msg, 'warning');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Guardando...' });
    await loading.present();

    let idEstadoTicket = this.ticketForm.get('idEstadoTicket')?.value;
    try {
      const value = this.ticketForm.value;
      const now = new Date().toISOString();
      let idAgente = value.agente?.idAgente || null;
      let idDepartamentoA = value.departamentoAgente?.idDepartamentoA || null;
      if (!idAgente || !idDepartamentoA) {
        idAgente = null;
        idDepartamentoA = null;
      } else {
        if (idEstadoTicket === '1') {
          idEstadoTicket = '2';
        }
      }
      const payload = {
        idTicket: value.idTicket || '',
        titulo: value.titulo,
        descripcion: value.descripcion,
        idDepartamentoA,
        idAgente,
        idPrioridad: value.prioridad?.idPrioridad || null,
        idSla: value.sla?.idSla,
        idUsuario: this.idUsuario,
        idfuenteContacto: '1',
        idTemaAyuda: value.temaAyuda?.idTemaAyuda,
        resueltoPrimerContacto: '0',
        idEstadoTicket: idEstadoTicket,
        emailUsuario: this.emailUsuario,
        nombreUsuario: this.nombreCompletoUsuario,
        fechaCreacion: now
      };

      const formData = this.apiService.createFormData(payload);
      console.log('formData:', formData);

      const response = await (await this.apiService.postData(formData, this.operation)).toPromise();

      this.showToast(mensaje, 'success');
      this.ticketForm.reset();
      this.navCtrl.navigateBack('/ticket');
    }
    catch (error) {
      // El error ya fue manejado con Toast en ApiService
      console.error('Error al guardar el ticket:', error);
    } finally {
      await loading.dismiss();
    }
  }

  async escalarTicket() {
    const alerta = await this.alertController.create({
      header: 'Escalar Ticket',
      message: '¿Desea continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Aceptar', handler: () => {
            this.abrirModalEscalar(this.ticket);
          }
        }
      ]
    });
    await alerta.present();
  }

  async abrirModalEscalar(ticket: any) {
    const modal = await this.modalCtrl.create({
      component: AsignarAgenteComponent,
      componentProps: {
        ticket,
        departamentoAgentes: this.departamentoAgentes,
        todosAgentes: this.agentes,
        opcion: 2 // Escalar
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data?.confirmado) {
      this.confirmarEscalamientoAgente(ticket, data);
    } else {
      this.showToast('Escalamiento cancelado.', 'warning');
      // this.loadTickets();
      // this.searchTerm = '';
      // this.estadoSeleccionado = 'all';
    }
  }

  async confirmarEscalamientoAgente(ticket: any, respuesta: any) {
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
      formData.append('idEstadoTicket', '6');

      const data = await (await this.apiService.postFormData('controllers/ticket.controller.php?op=actualizaragente', formData)).toPromise();
      await loading.dismiss();;
      this.showToast('Ticket Escalado correctamente.', 'success');
      // this.searchTerm = '';
      // this.estadoSeleccionado = 'all';
      // this.loadTickets();
    } catch (error) {
      this.showToast('No se pudo asignar el agente.', 'danger');
    } finally {
      this.loading = false;
      await loading.dismiss();
    }
  }

  async confirmCerrarTicket() {
    const alerta = await this.alertController.create({
      header: 'Cerrar Ticket',
      message: '¿Está seguro de continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Aceptar', handler: () => this.cerrarTicket() }
      ]
    });
    await alerta.present();
  }

  async cerrarTicket() {
    this.loading = true;
    const loading = await this.loadingController.create({
      message: 'Cerrar Ticket...',
      spinner: 'circles'
    });
    try {
      await loading.present();
      const formData = new FormData();
      formData.append('idTicket', this.ticket.idTicket);
      formData.append('idEstadoTicket', '4');
      formData.append('accion', '1');

      const data = await (await this.apiService.postFormData('controllers/ticket.controller.php?op=cerrarReaperturarTicket', formData)).toPromise();
      await loading.dismiss();
      this.showToast('Ticket Cerrar correctamente.', 'success');
    } catch (error) {
      this.showToast('No se pudo Cerrar el Ticket.', 'danger');
    } finally {
      this.loading = false;
      await loading.dismiss();
    }
  }

  async confirmReaperturaTicket() {
    const alerta = await this.alertController.create({
      header: 'Reaperturar Ticket',
      message: '¿Está seguro de continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Aceptar', handler: () => this.reaperturaTicket() }
      ]
    });
    await alerta.present();
  }

  async reaperturaTicket() {
    this.loading = true;
    const loading = await this.loadingController.create({
      message: 'Reapertura Ticket...',
      spinner: 'circles'
    });
    try {
      await loading.present();
      const formData = new FormData();
      formData.append('idTicket', this.ticket.idTicket);
      formData.append('idEstadoTicket', '9');
      formData.append('accion', '2'); // Reapertura

      const data = await (await this.apiService.postFormData('controllers/ticket.controller.php?op=cerrarReaperturarTicket', formData)).toPromise();
      await loading.dismiss();
      this.showToast('Ticket Reaperturado correctamente.', 'success');
    } catch (error) {
      this.showToast('No se pudo Reaperturar el Ticket.', 'danger');
    } finally {
      this.loading = false;
      await loading.dismiss();
    }
  }

  public async fechaInicioAtencion(ticket: any) {
    const alerta = await this.alertController.create({
      header: 'Iniciar atención',
      message: '¿Está seguro de iniciar la atención del ticket?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Aceptar', handler: () => this.iniciarAtencion() }
      ]
    });
    await alerta.present();
  }

  async iniciarAtencion() {
    const mensaj = 'Se ha iniciado la atención del Ticket';
    const fechaActual = new Date()
      .toLocaleString('sv-SE', { timeZone: 'America/Guayaquil' })
      .replace('T', ' ');
    // this.ticketForm.patchValue({
    //   fechaInicioAtencion: fechaActual,
    //   estadoTicket: this.estadoTickets.find(e => e.idEstadoTicket === '3'),
    //   idEstadoTicket: '3'
    // });

    // const value = this.ticketForm.value;
    // const payload = {
    //   idTicket: value.idTicket || '',
    //   titulo: value.titulo,
    //   descripcion: value.descripcion,
    //   idDepartamentoA: value.idDepartamentoA,
    //   idAgente: value.idAgente,
    //   idPrioridad: value.prioridad?.idPrioridad || null,
    //   idSla: value.sla?.idSla,
    //   idUsuario: this.idUsuario,
    //   idfuenteContacto: '1',
    //   idTemaAyuda: value.temaAyuda?.idTemaAyuda,
    //   resueltoPrimerContacto: '0',
    //   idEstadoTicket: value.idEstadoTicket,
    //   emailUsuario: this.emailUsuario,
    //   nombreUsuario: this.nombreCompletoUsuario,
    //   fechaCreacion: value.fechaCreacion,
    //   fechaInicioAtencion: value.fechaInicioAtencion
    // };

    const formData = new FormData();
    formData.append('idTicket', this.ticketForm.get('idTicket')?.value);
    formData.append('idEstadoTicket', String(3));
    formData.append('fechaInicioAtencion', this.ticketForm.get('fechaInicioAtencion')?.value);
    const endpoint = 'controllers/ticket.controller.php?op=inicioAtencion';
    const response = await (await this.apiService.postFormData(endpoint, formData)).toPromise();
    if (this.validarRol.esAgente()) {
      location.reload();
    }
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

  async showToast(msg: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      color
    });
    toast.present();
  }

  get cargando(): boolean {
    return this.loading || !this.ticketForm;
  }
}
